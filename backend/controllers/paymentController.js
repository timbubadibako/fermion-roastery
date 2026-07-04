import { Xendit } from 'xendit-node';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { supabase } from '../lib/supabase.js';
import { generateInvoicePDF } from '../lib/pdfGenerator.js';
import { publishEvent } from '../lib/ably.js';
import { sendOrderNotification } from '../lib/notifications.js';
import { logError, logInfo } from '../lib/logger.js';
import { sanitizeError, verifyStaticWebhookSecret } from '../lib/security.js';
import { getAppUrl, getBiteshipOrigin } from '../lib/runtimeConfig.js';
import { buildGuestTrackingUrl, buildOrderInvoiceUrl, buildOrderPortalUrl } from '../lib/orderLinks.js';
import { sendOrderCreatedEmail, sendPaymentPaidEmail } from '../lib/emailService.js';

dotenv.config();

const xendit = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY,
});

const BITESHIP_API_KEY = process.env.BITESHIP_API_KEY;
const BITESHIP_URL = 'https://api.biteship.com/v1';
const biteshipHeaders = {
  'Authorization': `Bearer ${BITESHIP_API_KEY}`,
  'Content-Type': 'application/json'
};

const ORIGIN_DETAILS = getBiteshipOrigin();

const parseWeightToKg = (value) => {
  if (value == null) return 0.25;
  const match = String(value).trim().toLowerCase().match(/(\d+(?:\.\d+)?)(g|kg)/);
  if (!match) return 0.25;

  const numericWeight = Number(match[1]);
  if (!Number.isFinite(numericWeight) || numericWeight <= 0) return 0.25;

  return match[2] === 'kg' ? numericWeight : numericWeight / 1000;
};

const parseWeightToGrams = (value) => Math.round(parseWeightToKg(value) * 1000);

const extractItemWeight = (item) => {
  if (item?.weight) return String(item.weight).trim();

  const match = String(item?.name || '').match(/\(([^)]+)\)/);
  return match?.[1]?.trim() || '250g';
};

const extractCleanItemName = (item) => {
  const rawName = String(item?.name || '').trim();
  return rawName.replace(/\s*\([^)]+\)\s*$/, '').trim();
};

const CREATED_EMAIL_DEBOUNCE_MINUTES = 2;

export const createInvoice = async (req, res) => {
  const { amount, items, customerDetails, metadata } = req.body;
  const shipping = metadata?.shipping || {};
  const profileId = metadata?.b2b ? req.user?.id : metadata?.profileId || null;
  const shippingFee = metadata?.shippingFee || 0;
  const courier = metadata?.courier || null;

  let calculatedAmount = Number(amount);
  let calculatedShippingFee = Number(shippingFee);
  let isB2bOrder = false;

  try {
    if (metadata?.b2b && !profileId) {
      return res.status(401).json({ message: "Authentication required for B2B checkout" });
    }

    // 0. B2B Pricing Verification & Enforcement
    if (profileId) {
       const { data: partner } = await supabase
         .from('b2b_partners')
         .select('status, tier_name')
         .eq('profile_id', profileId)
         .maybeSingle();
         
       if (partner && partner.status === 'approved') {
          isB2bOrder = true;
          // Enforce free shipping
          calculatedShippingFee = 0;
          if (metadata) metadata.shippingFee = 0;
          if (courier) courier.price = 0;

          // B2B prices are already resolved in product API/cart. Do not discount again here.
          let totalVolumeKg = 0;
          let submittedTotal = 0;

          items.forEach(item => {
             submittedTotal += Number(item.price) * Number(item.quantity);
             totalVolumeKg += parseWeightToKg(extractItemWeight(item)) * Number(item.quantity);
          });

         calculatedAmount = submittedTotal;
          
          logInfo('checkout.b2b.enforced', { profileId, tier: partner.tier_name, totalVolumeKg, submittedTotal, calculatedAmount });
       } else if (metadata?.b2b) {
          return res.status(403).json({ message: "B2B partner is not approved for checkout" });
       }
    }

    const referenceId = `invoice-${uuidv4()}`;

    // 1. Create Biteship Draft Order First
    let biteshipDraftId = null;
    if (courier && (shipping.area_id || shipping.postal_code)) {
      try {
        const draftPayload = {
          origin_contact_name: "Fermion Roastery",
          origin_contact_phone: "081234567890",
          origin_address: "Jl. Kesambi No. 202, Cirebon",
          origin_area_id: ORIGIN_DETAILS.area_id,
          origin_postal_code: ORIGIN_DETAILS.postal_code,
          destination_contact_name: customerDetails?.name || "Customer",
          destination_contact_phone: customerDetails?.phone || "08123456789",
          destination_address: shipping.address || "",
          destination_area_id: shipping.area_id,
          destination_postal_code: Number(shipping.postal_code),
          courier_company: courier.courier_code,
          courier_type: courier.courier_service_code,
          delivery_type: "now",
          items: items.map(item => {
            return {
              name: extractCleanItemName(item),
              description: item.name, // Required by some Biteship endpoints
              value: Math.round(Number(item.price)),
              quantity: Math.round(Number(item.quantity)),
              weight: parseWeightToGrams(extractItemWeight(item))
            };
          })
        };

        const draftRes = await axios.post(`${BITESHIP_URL}/draft_orders`, draftPayload, { headers: biteshipHeaders });
        biteshipDraftId = draftRes.data.id;
        logInfo('shipping.draft_order.created', { biteshipDraftId });
      } catch (bsError) {
        logError('shipping.draft_order.failed', bsError);
        // We continue even if Biteship fails, we can fix it manually later
      }
    }

    // 2. Save to Database (UNPAID)
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          profile_id: profileId,
          xendit_invoice_id: referenceId,
          biteship_order_id: biteshipDraftId,
          status: 'UNPAID',
          total_amount: calculatedAmount,
          shipping_fee: calculatedShippingFee,
          shipping_courier: courier?.courier_name || null,
          customer_name: customerDetails?.name || 'Guest',
          customer_email: customerDetails?.email || 'guest@example.com',
          customer_phone: customerDetails?.phone || '-',
          shipping_address: shipping.address || 'Pickup',
          shipping_city: shipping.city || 'Cirebon',
          shipping_notes: shipping.notes || '',
          created_email_scheduled_for: isB2bOrder
            ? null
            : new Date(Date.now() + CREATED_EMAIL_DEBOUNCE_MINUTES * 60 * 1000).toISOString()
        }
      ])
      .select()
      .single();

    if (orderError) throw orderError;
    const orderId = orderData.id;

    // Insert into order_items
    const orderItemsToInsert = items.map(item => {
      return {
        order_id: orderId,
        product_id: item.id || null,
        product_name: extractCleanItemName(item),
        variant_weight: extractItemWeight(item),
        variant_grind: item.grind || 'Whole Bean',
        quantity: item.quantity,
        unit_price: item.price
      };
    });

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsToInsert);

    if (itemsError) throw itemsError;

    // 3. Generate Xendit Invoice
    const origin = req.headers.origin || getAppUrl();
    const successUrl = metadata?.b2b 
      ? `${origin}/b2b/invoice/${orderId}`
      : `${origin}/retail/success`;
    const failureUrl = metadata?.b2b 
      ? `${origin}/b2b/invoice/${orderId}`
      : `${origin}/retail/failure`;

    const data = {
      externalId: referenceId,
      amount: calculatedAmount,
      payerEmail: customerDetails?.email || 'guest@example.com',
      description: 'Fermion Roastery Coffee Order',
      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      successRedirectUrl: successUrl,
      failureRedirectUrl: failureUrl,
    };

    const response = await xendit.Invoice.createInvoice({ data });

    try {
      await generateInvoicePDF(orderId);
    } catch (pdfError) {
      logError('invoice.generate_after_create.failed', pdfError, { orderId });
    }

    const createdOrder = {
      ...orderData,
      profile_id: profileId,
      type: metadata?.b2b ? 'b2b' : 'retail',
    };
    const orderPortalUrl = buildOrderPortalUrl(createdOrder);
    const guestTrackingUrl = !profileId ? buildGuestTrackingUrl(createdOrder) : null;
    const invoiceDownloadUrl = buildOrderInvoiceUrl(createdOrder);

    res.status(200).json({
      invoiceUrl: response.invoiceUrl,
      externalId: response.externalId,
      orderId: orderId,
      guestTrackingUrl,
      orderPortalUrl,
    });
    logInfo('payment.invoice.created', { orderId, externalId: response.externalId, amount: calculatedAmount, orderType: isB2bOrder ? 'b2b' : 'retail' });
  } catch (error) {
    logError('payment.invoice.create_failed', error);
    res.status(500).json(sanitizeError(error, "Failed to create payment invoice"));
  }
};

export const createSubscription = async (req, res) => {
  const { amount, planName, planId, customerDetails, interval, intervalCount, shippingAddress, profileId } = req.body;

  try {
    const referenceId = `sub-${uuidv4()}`;

    // 1. Create Order record with type 'subscription'
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          profile_id: profileId,
          status: 'UNPAID',
          total_amount: amount,
          customer_name: customerDetails.name,
          customer_email: customerDetails.email,
          customer_phone: customerDetails.phone,
          shipping_address: shippingAddress.address,
          shipping_city: shippingAddress.city || 'Cirebon',
          type: 'subscription'
        }
      ])
      .select()
      .single();

    if (orderError) throw orderError;
    const orderId = orderData.id;

    // 2. Create Active Subscription record
    const { error: subError } = await supabase
      .from('subscriptions')
      .insert([
        {
          profile_id: profileId,
          plan_id: planId,
          plan_name: planName,
          status: 'active'
        }
      ]);

    if (subError) throw subError;

    const appUrl = getAppUrl().replace(/\/$/, '');
    const data = {
      externalId: referenceId, // Or use orderId
      amount: amount,
      payerEmail: customerDetails?.email || 'subscriber@example.com',
      description: `Fermion Subscription: ${planName} (Auto-renews)`,
      successRedirectUrl: `${appUrl}/subscription/success`,
      failureRedirectUrl: `${appUrl}/subscription/failure`,
    };

    const response = await xendit.Invoice.createInvoice({ data });

    res.status(200).json({
      invoiceUrl: response.invoiceUrl,
      subscriptionId: referenceId,
      message: "Subscription initial charge created"
    });
  } catch (error) {
    console.error('Xendit Subscription Error:', error);
    res.status(500).json({ message: "Failed to create subscription", error: error.message });
  }
};

export const handleNotification = async (req, res) => {
  const { external_id, status } = req.body;

  try {
    const providedSecret = req.headers['x-callback-token'] || req.headers['x-webhook-token'];
    if (!verifyStaticWebhookSecret(providedSecret, process.env.XENDIT_WEBHOOK_TOKEN)) {
      return res.status(401).json({ message: 'Unauthorized webhook request' });
    }

    // 0. Flexible Lookup: Try xendit_invoice_id first, then fallback to internal order id
    let { data: orderData, error: lookupError } = await supabase
      .from('orders')
      .select('status, id, profile_id, type, biteship_order_id, customer_name, customer_email, customer_phone, created_email_sent_at')
      .eq('xendit_invoice_id', external_id)
      .maybeSingle();

    if (!orderData) {
      // Clean ID from # if present
      const cleanId = external_id.replace('#', '').toLowerCase();

      const { data: fallbackData } = await supabase
        .from('orders')
        .select('status, id, profile_id, type, biteship_order_id, customer_name, customer_email, customer_phone, created_email_sent_at')
        .eq('id', cleanId)
        .maybeSingle();

      orderData = fallbackData;
    }

    if (!orderData) {
      logInfo('payment.webhook.unknown_order', { externalId: external_id });
      return res.status(200).send("OK");
    }

    // If already paid or beyond, skip
    if (['PAID', 'ROASTING', 'READY_TO_SHIP', 'SHIPPED', 'DELIVERED'].includes(orderData.status)) {
      logInfo('payment.webhook.already_processed', { orderId: orderData.id, status: orderData.status });
      return res.status(200).send("OK");
    }

    // 1. Update status to PAID if payment is completed/settled
    if (status === 'PAID' || status === 'SETTLED') {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'PAID', updated_at: new Date(), created_email_scheduled_for: null })
        .eq('xendit_invoice_id', external_id);

      if (updateError) throw updateError;

      logInfo('payment.webhook.paid', { orderId: orderData.id });
      publishEvent('orders', 'order_updated', { id: orderData.id, status: 'PAID' });
      await sendOrderNotification(orderData.id, orderData.customer_name, orderData.customer_email, orderData.customer_phone);

      // --- INVENTORY SYNC ---
      try {
        const { data: items, error: itemsError } = await supabase
          .from('order_items')
          .select('product_id, variant_weight, quantity')
          .eq('order_id', orderData.id)
          .not('product_id', 'is', null);

        if (itemsError) throw itemsError;

        for (const item of items) {
          const deductionUnits = item.quantity * (parseWeightToGrams(item.variant_weight) / 250);

          if (deductionUnits > 0) {
            const { data: product } = await supabase
              .from('products')
              .select('stock_quantity')
              .eq('id', item.product_id)
              .single();

            if (product) {
              await supabase
                .from('products')
                .update({ stock_quantity: product.stock_quantity - deductionUnits })
                .eq('id', item.product_id);
              logInfo('inventory.deducted', { productId: item.product_id, deductionUnits, orderId: orderData.id });
            }
          }
        }
      } catch (invError) {
        logError('inventory.sync.failed', invError, { orderId: orderData.id });
      }
      // ----------------------

      // --- BITESHIP CONFIRMATION ---
      if (orderData.biteship_order_id) {
        try {
          const confirmRes = await axios.post(`${BITESHIP_URL}/draft_orders/${orderData.biteship_order_id}/confirm`, {}, { headers: biteshipHeaders });

          const finalOrderId = confirmRes.data.id;
          const waybillId = confirmRes.data.courier.waybill_id;

          // Biteship dashboard provides the functional label route
          const labelUrl = confirmRes.data.label_url ||
            confirmRes.data.courier?.label_url ||
            `https://dashboard.biteship.com/labels/${finalOrderId}`;

          await supabase
            .from('orders')
            .update({
              biteship_order_id: finalOrderId,
              shipping_awb: waybillId,
              shipping_label_url: labelUrl,
              status: 'READY_TO_SHIP'
            })
            .eq('xendit_invoice_id', external_id);

          logInfo('shipping.order.confirmed', { orderId: orderData.id, finalOrderId, waybillId });
          publishEvent('orders', 'order_updated', { id: orderData.id, status: 'READY_TO_SHIP', awb: waybillId });
        } catch (bsError) {
          logError('shipping.order.confirm_failed', bsError, { orderId: orderData.id });
        }
      }
      // ----------------------------

      // 2. Generate PDF invoice without blocking payment flow on serverless file errors
      try {
        const generatedInvoice = await generateInvoicePDF(orderData.id);
        const orderForEmail = { ...orderData, status: 'PAID' };
        const orderPortalUrl = buildOrderPortalUrl(orderForEmail);
        const invoiceDownloadUrl = buildOrderInvoiceUrl(orderForEmail);
        await sendPaymentPaidEmail({
          order: orderForEmail,
          portalUrl: orderPortalUrl,
          invoiceUrl: invoiceDownloadUrl,
          invoiceAttachment: { filename: generatedInvoice.fileName, content: generatedInvoice.buffer },
        });
      } catch (pdfError) {
        logError('invoice.generate.failed', pdfError, { orderId: orderData.id });
      }

      // --- 3. AUTO-EVALUATE B2B TIER ---
      try {
        const { data: orderProfile } = await supabase
          .from('orders')
          .select('profile_id')
          .eq('id', orderData.id)
          .single();
        
        if (orderProfile && orderProfile.profile_id) {
           const { data: partner } = await supabase
             .from('b2b_partners')
             .select('tier_name, status')
             .eq('profile_id', orderProfile.profile_id)
             .maybeSingle();

           if (partner && partner.status === 'approved') {
              // Sum total volume in last 30 days
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

              const { data: recentOrders } = await supabase
                .from('orders')
                .select('id')
                .eq('profile_id', orderProfile.profile_id)
                .gte('created_at', thirtyDaysAgo.toISOString())
                .in('status', ['PAID', 'ROASTING', 'READY_TO_SHIP', 'SHIPPED', 'DELIVERED']);

              if (recentOrders && recentOrders.length > 0) {
                 const orderIds = recentOrders.map(o => o.id);
                 const { data: recentItems } = await supabase
                   .from('order_items')
                 .select('variant_weight, quantity')
                   .in('order_id', orderIds);
                 
                 let totalVolumeKg = 0;
                 recentItems?.forEach(item => {
                   totalVolumeKg += parseWeightToKg(item.variant_weight) * item.quantity;
                 });

                 // Upgrade Rules: Silver (50kg+), Gold (100kg+)
                 let newTier = partner.tier_name;
                 if (totalVolumeKg >= 100 && partner.tier_name !== 'Gold') {
                    newTier = 'Gold';
                 } else if (totalVolumeKg >= 50 && totalVolumeKg < 100 && partner.tier_name === 'Bronze') {
                    newTier = 'Silver';
                 }

                 if (newTier !== partner.tier_name) {
                    await supabase.from('b2b_partners').update({ tier_name: newTier }).eq('profile_id', orderProfile.profile_id);
                    logInfo('b2b.partner.auto_upgrade', { profileId: orderProfile.profile_id, from: partner.tier_name, to: newTier });
                 }
              }
           }
        }
      } catch (tierError) {
        logError('b2b.partner.auto_upgrade_failed', tierError, { orderId: orderData.id });
      }

    } else if (status === 'EXPIRED') {
      await supabase
        .from('orders')
        .update({ status: 'CANCELLED', updated_at: new Date() })
        .eq('xendit_invoice_id', external_id);
      logInfo('payment.webhook.expired', { externalId: external_id });
    }

    res.status(200).send("OK");
  } catch (error) {
    logError('payment.webhook.failed', error, { externalId: external_id, status });
    res.status(500).json(sanitizeError(error, "Internal Server Error"));
  }
};

export const createManualInvoice = async (req, res) => {
  const { amount, items, customerDetails, metadata, paymentType } = req.body;
  const shipping = metadata?.shipping || {};
  const profileId = req.user?.id;
  
  let calculatedAmount = Number(amount);

  try {
    if (!profileId) {
      return res.status(401).json({ message: "Authentication required for B2B manual payment" });
    }

    if (!['tempo', 'cash_offline'].includes(paymentType)) {
      return res.status(400).json({ message: "Invalid manual payment type" });
    }

    if (profileId) {
       const { data: partner } = await supabase
         .from('b2b_partners')
         .select('status, tier_name')
         .eq('profile_id', profileId)
         .maybeSingle();
         
       if (partner && partner.status === 'approved') {
          let totalVolumeKg = 0;
          let submittedTotal = 0;

          items.forEach(item => {
             submittedTotal += Number(item.price) * Number(item.quantity);
             totalVolumeKg += parseWeightToKg(extractItemWeight(item)) * Number(item.quantity);
          });

          calculatedAmount = submittedTotal;
       } else {
          return res.status(403).json({ message: "B2B partner is not approved for manual checkout" });
       }
    }

    const referenceId = `manual-${uuidv4()}`;

    // Biteship Draft
    let biteshipDraftId = null;
    if (shipping.area_id || shipping.postal_code) {
      try {
        const draftPayload = {
          origin_contact_name: "Fermion Roastery",
          origin_contact_phone: "081234567890",
          origin_address: "Jl. Kesambi No. 202, Cirebon",
          origin_area_id: ORIGIN_DETAILS.area_id,
          origin_postal_code: ORIGIN_DETAILS.postal_code,
          destination_contact_name: customerDetails?.name || "Customer",
          destination_contact_phone: customerDetails?.phone || "08123456789",
          destination_address: shipping.address || "",
          destination_area_id: shipping.area_id,
          destination_postal_code: Number(shipping.postal_code),
          courier_company: "jnt",
          courier_type: "ez",
          delivery_type: "now",
          items: items.map(item => ({
            name: extractCleanItemName(item),
            description: `Grind: ${item.grind || 'Whole Bean'}`,
            value: item.price,
            quantity: item.quantity,
            weight: parseWeightToGrams(extractItemWeight(item))
          }))
        };
        const draftRes = await axios.post(`${BITESHIP_URL}/draft_orders`, draftPayload, { headers: biteshipHeaders });
        biteshipDraftId = draftRes.data.id;
      } catch (bsError) {
        logError('shipping.manual_draft.failed', bsError, { profileId });
      }
    }

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          profile_id: profileId,
          xendit_invoice_id: referenceId,
          biteship_order_id: biteshipDraftId,
          total_amount: calculatedAmount,
          status: paymentType === 'tempo' ? 'NET30' : 'PENDING_CASH',
          customer_name: customerDetails?.name,
          customer_email: customerDetails?.email,
          customer_phone: customerDetails?.phone,
          shipping_address: shipping.address,
          shipping_city: shipping.city || 'Cirebon',
          type: 'b2b'
        }
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert Order Items
    const orderItems = items.map(item => ({
      order_id: orderData.id,
      product_id: item.id,
      product_name: extractCleanItemName(item),
      variant_weight: extractItemWeight(item),
      variant_grind: item.grind || 'Whole Bean',
      quantity: item.quantity,
      unit_price: item.price
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    if (itemsError) throw itemsError;

    publishEvent('orders', 'order_updated', { id: orderData.id, status: orderData.status });

    try {
      const generatedInvoice = await generateInvoicePDF(orderData.id);
      await sendOrderCreatedEmail({
        order: orderData,
        portalUrl: buildOrderPortalUrl(orderData),
        invoiceUrl: buildOrderInvoiceUrl(orderData),
        paymentUrl: null,
        invoiceAttachment: { filename: generatedInvoice.fileName, content: generatedInvoice.buffer },
      });
    } catch (pdfError) {
      logError('invoice.manual_generate.failed', pdfError, { orderId: orderData.id });
    }

    res.status(200).json({
      invoiceUrl: `/b2b/ledger`, // Redirect them straight to ledger
      orderId: orderData.id,
      message: "Manual order created successfully"
    });

  } catch (error) {
    logError('payment.manual_invoice.failed', error, { profileId });
    res.status(500).json(sanitizeError(error, "Failed to create manual invoice"));
  }
};
