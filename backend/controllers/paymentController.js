import { Xendit } from 'xendit-node';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { supabase } from '../lib/supabase.js';
import { generateInvoicePDF } from '../lib/pdfGenerator.js';
import { publishEvent } from '../lib/ably.js';
import { sendOrderNotification } from '../lib/notifications.js';
// TODO: [MAILER] Integrate Resend / Nodemailer here for email notifications
// Example: import { sendEmail } from '../lib/mailer.js';

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

// Default Origin (Fermion Roastery Cirebon - Kesambi)
const ORIGIN_DETAILS = {
  area_id: "IDNP9IDNC105IDND151IDZ45131",
  postal_code: 45131
};

export const createInvoice = async (req, res) => {
  const { amount, items, customerDetails, metadata } = req.body;
  const shipping = metadata?.shipping || {};
  const profileId = metadata?.profileId || null;
  const shippingFee = metadata?.shippingFee || 0;
  const courier = metadata?.courier || null;

  let calculatedAmount = Number(amount);
  let calculatedShippingFee = Number(shippingFee);
  let isB2bOrder = false;

  try {
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

          // Calculate total volume
          let totalVolumeKg = 0;
          let baseTotal = 0;

          items.forEach(item => {
             baseTotal += Number(item.price) * Number(item.quantity);
             const weightMatch = String(item.name).match(/\((\d+)(g|kg)\)/i);
             let itemWeightKg = 0.25; // default 250g
             if (weightMatch) {
               const val = parseFloat(weightMatch[1]);
               const unit = weightMatch[2].toLowerCase();
               itemWeightKg = unit === 'kg' ? val : val / 1000;
             }
             totalVolumeKg += itemWeightKg * Number(item.quantity);
          });

          // Apply Tier Discount
          let discountPerKg = 10000; // Default Bronze
          if (partner.tier_name === 'Silver') discountPerKg = 15000;
          else if (partner.tier_name === 'Gold') discountPerKg = 20000;

          const totalDiscount = totalVolumeKg * discountPerKg;
          calculatedAmount = Math.max(0, baseTotal - totalDiscount);
          
          console.log(`🔒 B2B Enforcement - Profile: ${profileId}, Tier: ${partner.tier_name}, Volume: ${totalVolumeKg}kg, RawTotal: ${baseTotal}, Discount: ${totalDiscount}, EnforcedTotal: ${calculatedAmount}`);
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
            // Parse weight from "(250g)" or "(500g)"
            const weightMatch = item.name.match(/\((\d+)(g|kg)\)/i);
            let itemWeight = 250;
            if (weightMatch) {
              const val = parseInt(weightMatch[1]);
              const unit = weightMatch[2].toLowerCase();
              itemWeight = unit === 'kg' ? val * 1000 : val;
            }

            return {
              name: item.name,
              description: item.name, // Required by some Biteship endpoints
              value: Math.round(Number(item.price)),
              quantity: Math.round(Number(item.quantity)),
              weight: itemWeight
            };
          })
        };

        console.log('🚀 Sending Draft Payload to Biteship:', JSON.stringify(draftPayload, null, 2));

        const draftRes = await axios.post(`${BITESHIP_URL}/draft_orders`, draftPayload, { headers: biteshipHeaders });
        biteshipDraftId = draftRes.data.id;
        console.log(`📦 Biteship Draft Created: ${biteshipDraftId}`);
      } catch (bsError) {
        console.error('⚠️ Biteship Draft Error:', bsError.response?.data || bsError.message);
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
          shipping_notes: shipping.notes || ''
        }
      ])
      .select()
      .single();

    if (orderError) throw orderError;
    const orderId = orderData.id;

    // Insert into order_items
    const orderItemsToInsert = items.map(item => {
      // Try to parse weight from "Name (Weight)"
      const nameParts = item.name.match(/(.*)\s\((.*?)\)/);
      const cleanName = nameParts ? nameParts[1].trim() : item.name;
      const weight = nameParts ? nameParts[2] : '250g';

      return {
        order_id: orderId,
        product_id: item.id || null,
        product_name: cleanName,
        variant_weight: weight,
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
    const origin = req.headers.origin || 'https://fermionroastery.com';
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

    res.status(200).json({
      invoiceUrl: response.invoiceUrl,
      externalId: response.externalId,
      orderId: orderId
    });
  } catch (error) {
    console.error('Xendit Error:', error);
    res.status(500).json({ message: "Failed to create payment invoice", error: error.message });
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

    const data = {
      externalId: referenceId, // Or use orderId
      amount: amount,
      payerEmail: customerDetails?.email || 'subscriber@example.com',
      description: `Fermion Subscription: ${planName} (Auto-renews)`,
      successRedirectUrl: 'https://fermionroastery.com/subscription/success',
      failureRedirectUrl: 'https://fermionroastery.com/subscription/failure',
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
  console.log("Xendit Payment Notification Received:", JSON.stringify(req.body, null, 2));

  const { external_id, status } = req.body;

  try {
    // 0. Flexible Lookup: Try xendit_invoice_id first, then fallback to internal order id
    let { data: orderData, error: lookupError } = await supabase
      .from('orders')
      .select('status, id, biteship_order_id, customer_name, customer_email, customer_phone')
      .eq('xendit_invoice_id', external_id)
      .maybeSingle();

    if (!orderData) {
      console.log(`🔍 Invoice ID not found, trying fallback to Order ID: ${external_id}`);
      // Clean ID from # if present
      const cleanId = external_id.replace('#', '').toLowerCase();

      const { data: fallbackData } = await supabase
        .from('orders')
        .select('status, id, biteship_order_id, customer_name, customer_email, customer_phone')
        .eq('id', cleanId)
        .maybeSingle();

      orderData = fallbackData;
    }

    if (!orderData) {
      console.log(`❌ ERROR: Webhook received for completely unknown ID: ${external_id}`);
      return res.status(200).send("OK");
    }

    console.log(`📦 Found Order: ${orderData.id} (Current Status: ${orderData.status})`);

    // If already paid or beyond, skip
    if (['PAID', 'ROASTING', 'READY_TO_SHIP', 'SHIPPED', 'DELIVERED'].includes(orderData.status)) {
      console.log(`ℹ️ Order ${orderData.id} already processed. Skipping.`);
      return res.status(200).send("OK");
    }

    // 1. Update status to PAID if payment is completed/settled
    if (status === 'PAID' || status === 'SETTLED') {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'PAID', updated_at: new Date() })
        .eq('xendit_invoice_id', external_id);

      if (updateError) throw updateError;

      console.log(`✅ Order ${orderData.id} status updated to PAID via Webhook.`);
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
          let deductionUnits = 0;
          const weightLower = (item.variant_weight || "250g").toLowerCase();

          if (weightLower.includes('250g')) {
            deductionUnits = item.quantity * 1;
          } else if (weightLower.includes('500g')) {
            deductionUnits = item.quantity * 2;
          } else if (weightLower.includes('1kg') || weightLower.includes('1000g')) {
            deductionUnits = item.quantity * 4;
          } else {
            // Fallback dynamic parser
            const match = weightLower.match(/(\d+)(g|kg)/);
            if (match) {
              const val = parseInt(match[1]);
              const unit = match[2];
              const grams = unit === 'kg' ? val * 1000 : val;
              deductionUnits = item.quantity * (grams / 250);
            }
          }

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
              console.log(`📦 Inventory Sync: Deducted ${deductionUnits} units (250g/unit) from product ${item.product_id}`);
            }
          }
        }
      } catch (invError) {
        console.error('❌ Inventory Sync Error:', invError);
      }
      // ----------------------

      // --- BITESHIP CONFIRMATION ---
      if (orderData.biteship_order_id) {
        try {
          console.log(`🔔 Confirming Biteship Draft: ${orderData.biteship_order_id}`);
          const confirmRes = await axios.post(`${BITESHIP_URL}/draft_orders/${orderData.biteship_order_id}/confirm`, {}, { headers: biteshipHeaders });
          console.log('📦 Biteship Confirm Response:', JSON.stringify(confirmRes.data, null, 2));

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

          console.log(`✅ Biteship Order Confirmed. Resi: ${waybillId} | Label: ${labelUrl}`);
          publishEvent('orders', 'order_updated', { id: orderData.id, status: 'READY_TO_SHIP', awb: waybillId });
        } catch (bsError) {
          console.error('❌ Biteship Confirm Error:', bsError.response?.data || bsError.message);
        }
      }
      // ----------------------------

      // 2. Generate PDF Invoice automatically
      await generateInvoicePDF(orderData.id);

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
                   const weightStr = (item.variant_weight || "250g").toLowerCase();
                   const match = weightStr.match(/(\d+)(g|kg)/);
                   if (match) {
                     const val = parseInt(match[1]);
                     totalVolumeKg += (match[2] === 'kg' ? val : val / 1000) * item.quantity;
                   }
                 });

                 console.log(`📊 B2B Partner Evaluation: Profile ${orderProfile.profile_id} has ${totalVolumeKg}kg in last 30 days.`);

                 // Upgrade Rules: Silver (50kg+), Gold (100kg+)
                 let newTier = partner.tier_name;
                 if (totalVolumeKg >= 100 && partner.tier_name !== 'Gold') {
                    newTier = 'Gold';
                 } else if (totalVolumeKg >= 50 && totalVolumeKg < 100 && partner.tier_name === 'Bronze') {
                    newTier = 'Silver';
                 }

                 if (newTier !== partner.tier_name) {
                    await supabase.from('b2b_partners').update({ tier_name: newTier }).eq('profile_id', orderProfile.profile_id);
                    console.log(`🚀 AUTO UPGRADE: Partner ${orderProfile.profile_id} upgraded from ${partner.tier_name} to ${newTier}!`);
                 }
              }
           }
        }
      } catch (tierError) {
        console.error('❌ Tier Auto-Upgrade Error:', tierError);
      }

    } else if (status === 'EXPIRED') {
      await supabase
        .from('orders')
        .update({ status: 'CANCELLED', updated_at: new Date() })
        .eq('xendit_invoice_id', external_id);
      console.log(`❌ Order with invoice ${external_id} marked as CANCELLED via Webhook.`);
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error('Webhook Processing Error:', error);
    res.status(500).send("Internal Server Error");
  }
};

export const createManualInvoice = async (req, res) => {
  const { amount, items, customerDetails, metadata, paymentType } = req.body;
  const shipping = metadata?.shipping || {};
  const profileId = metadata?.profileId || null;
  
  let calculatedAmount = Number(amount);
  let isB2bOrder = false;

  try {
    if (profileId) {
       const { data: partner } = await supabase
         .from('b2b_partners')
         .select('status, tier_name')
         .eq('profile_id', profileId)
         .maybeSingle();
         
       if (partner && partner.status === 'approved') {
          isB2bOrder = true;
          let totalVolumeKg = 0;
          let baseTotal = 0;

          items.forEach(item => {
             baseTotal += Number(item.price) * Number(item.quantity);
             const weightMatch = String(item.name).match(/\((\d+)(g|kg)\)/i);
             let itemWeightKg = 0.25;
             if (weightMatch) {
               const val = parseFloat(weightMatch[1]);
               const unit = weightMatch[2].toLowerCase();
               itemWeightKg = unit === 'kg' ? val : val / 1000;
             }
             totalVolumeKg += itemWeightKg * Number(item.quantity);
          });

          let discountPerKg = 10000;
          if (partner.tier_name === 'Silver') discountPerKg = 15000;
          else if (partner.tier_name === 'Gold') discountPerKg = 20000;

          const totalDiscount = totalVolumeKg * discountPerKg;
          calculatedAmount = Math.max(0, baseTotal - totalDiscount);
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
            name: item.name,
            description: `Grind: ${item.grind || 'Whole Bean'}`,
            value: item.price,
            quantity: item.quantity,
            weight: 250
          }))
        };
        const draftRes = await axios.post(`${BITESHIP_URL}/draft_orders`, draftPayload, { headers: biteshipHeaders });
        biteshipDraftId = draftRes.data.id;
      } catch (bsError) {
        console.error('Manual Biteship Draft Error:', bsError.response?.data || bsError.message);
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
          status: 'PAID', // Directly PAID for B2B Tempo/Offline
          customer_name: customerDetails?.name,
          customer_email: customerDetails?.email,
          customer_phone: customerDetails?.phone,
          shipping_address: shipping.address,
          shipping_city: shipping.city || 'Cirebon',
          payment_method: paymentType === 'tempo' ? 'TEMPO' : 'OFFLINE_CASH',
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
      product_name: item.name,
      variant_weight: item.name.match(/\((.*?)\)/)?.[1] || '1KG',
      variant_grind: item.grind || 'Whole Bean',
      quantity: item.quantity,
      unit_price: item.price
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    if (itemsError) throw itemsError;

    // IMMEDIATELY PROCESS IT LIKE WEBHOOK
    // Inventory Sync
    for (const item of items) {
       let deductionUnits = 0;
       const weightMatch = item.name.match(/\((.*?)\)/);
       const weightLower = weightMatch ? weightMatch[1].toLowerCase() : "1kg";
       const match = weightLower.match(/(\d+)(g|kg)/);
       if (match) {
          const val = parseInt(match[1]);
          const unit = match[2];
          const grams = unit === 'kg' ? val * 1000 : val;
          deductionUnits = item.quantity * (grams / 250);
       }
       if (deductionUnits > 0) {
          const { data: product } = await supabase.from('products').select('stock_quantity').eq('id', item.id).single();
          if (product) {
             await supabase.from('products').update({ stock_quantity: product.stock_quantity - deductionUnits }).eq('id', item.id);
          }
       }
    }

    // Biteship Confirmation
    if (biteshipDraftId) {
      try {
        const confirmRes = await axios.post(`${BITESHIP_URL}/draft_orders/${biteshipDraftId}/confirm`, {}, { headers: biteshipHeaders });
        const finalOrderId = confirmRes.data.id;
        const waybillId = confirmRes.data.courier.waybill_id;
        const labelUrl = confirmRes.data.label_url || confirmRes.data.courier?.label_url || `https://dashboard.biteship.com/labels/${finalOrderId}`;

        await supabase.from('orders').update({
           biteship_order_id: finalOrderId,
           shipping_awb: waybillId,
           shipping_label_url: labelUrl,
           status: 'READY_TO_SHIP'
        }).eq('id', orderData.id);
        publishEvent('orders', 'order_updated', { id: orderData.id, status: 'READY_TO_SHIP', awb: waybillId });
      } catch (bsConfErr) {
        console.error('Manual Biteship Confirm Error:', bsConfErr);
      }
    }

    // PDF Generation
    await generateInvoicePDF(orderData.id);

    res.status(200).json({
      invoiceUrl: `/b2b/ledger`, // Redirect them straight to ledger
      orderId: orderData.id,
      message: "Manual order created successfully"
    });

  } catch (error) {
    console.error('Manual Payment Error:', error);
    res.status(500).json({ message: "Failed to create manual invoice", error: error.message });
  }
};
