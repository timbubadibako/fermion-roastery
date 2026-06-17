import { Xendit } from 'xendit-node';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { query } from '../lib/db.js';
import { generateInvoicePDF } from '../lib/pdfGenerator.js';
import { publishEvent } from '../lib/ably.js';
import { sendOrderNotification } from '../lib/notifications.js';

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

  try {
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
    await query('BEGIN');

    // Insert into orders
    const orderResult = await query(
      `INSERT INTO orders (
        profile_id, xendit_invoice_id, biteship_order_id, status, total_amount, shipping_fee, 
        shipping_courier, customer_name, customer_email, customer_phone, 
        shipping_address, shipping_city, shipping_notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`,
      [
        profileId, referenceId, biteshipDraftId, 'UNPAID', amount, shippingFee,
        courier?.courier_name || null,
        customerDetails?.name || 'Guest', 
        customerDetails?.email || 'guest@example.com', 
        customerDetails?.phone || '-', 
        shipping.address || 'Pickup', 
        shipping.city || 'Cirebon', 
        shipping.notes || ''
      ]
    );
    const orderId = orderResult.rows[0].id;

    // Insert into order_items
    for (const item of items) {
      // Try to parse weight from "Name (Weight)"
      const nameParts = item.name.match(/(.*)\s\((.*?)\)/);
      const cleanName = nameParts ? nameParts[1].trim() : item.name;
      const weight = nameParts ? nameParts[2] : '250g';

      await query(
        `INSERT INTO order_items (order_id, product_id, product_name, variant_weight, variant_grind, quantity, unit_price)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [orderId, item.id || null, cleanName, weight, item.grind || 'Whole Bean', item.quantity, item.price]
      );
    }

    await query('COMMIT');

    // 2. Generate Xendit Invoice
    const data = {
      externalId: referenceId,
      amount: amount,
      payerEmail: customerDetails?.email || 'guest@example.com',
      description: 'Fermion Roastery Coffee Order',
      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      successRedirectUrl: 'http://localhost:3000/retail/success',
      failureRedirectUrl: 'http://localhost:3000/retail/failure',
    };

    const response = await xendit.Invoice.createInvoice({ data });

    res.status(200).json({ 
      invoiceUrl: response.invoiceUrl,
      externalId: response.externalId,
      orderId: orderId
    });
  } catch (error) {
    await query('ROLLBACK');
    console.error('Xendit Error:', error);
    res.status(500).json({ message: "Failed to create payment invoice", error: error.message });
  }
};

export const createSubscription = async (req, res) => {
  const { amount, planName, planId, customerDetails, interval, intervalCount, shippingAddress, profileId } = req.body;

  try {
    const referenceId = `sub-${uuidv4()}`;
    
    await query('BEGIN');
    
    // 1. Create Order record with type 'subscription'
    const orderResult = await query(
      `INSERT INTO orders (profile_id, status, total_amount, customer_name, customer_email, customer_phone, shipping_address, shipping_city, type)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [profileId, 'UNPAID', amount, customerDetails.name, customerDetails.email, customerDetails.phone, shippingAddress.address, shippingAddress.city || 'Cirebon', 'subscription']
    );
    const orderId = orderResult.rows[0].id;

    // 2. Create Active Subscription record
    await query(
      `INSERT INTO subscriptions (profile_id, plan_id, plan_name, status)
       VALUES ($1, $2, $3, $4)`,
      [profileId, planId, planName, 'active']
    );
    
    await query('COMMIT');

    const data = {
      externalId: referenceId, // Or use orderId
      amount: amount,
      payerEmail: customerDetails?.email || 'subscriber@example.com',
      description: `Fermion Subscription: ${planName} (Auto-renews)`,
      successRedirectUrl: 'http://localhost:3000/subscription/success',
      failureRedirectUrl: 'http://localhost:3000/subscription/failure',
    };

    const response = await xendit.Invoice.createInvoice({ data });

    res.status(200).json({ 
      invoiceUrl: response.invoiceUrl,
      subscriptionId: referenceId,
      message: "Subscription initial charge created"
    });
  } catch (error) {
    await query('ROLLBACK');
    console.error('Xendit Subscription Error:', error);
    res.status(500).json({ message: "Failed to create subscription", error: error.message });
  }
};
export const handleNotification = async (req, res) => {
  console.log("Xendit Payment Notification Received:", JSON.stringify(req.body, null, 2));

  const { external_id, status } = req.body;

  try {
    // 0. Flexible Lookup: Try xendit_invoice_id first, then fallback to internal order id
    let currentOrderRes = await query("SELECT status, id, biteship_order_id, customer_name, customer_email, customer_phone FROM orders WHERE xendit_invoice_id = $1", [external_id]);
    
    if (currentOrderRes.rows.length === 0) {
      console.log(`🔍 Invoice ID not found, trying fallback to Order ID: ${external_id}`);
      // Clean ID from # if present
      const cleanId = external_id.replace('#', '').toLowerCase();
      currentOrderRes = await query("SELECT status, id, biteship_order_id, customer_name, customer_email, customer_phone FROM orders WHERE id::text = $1", [cleanId]);
    }

    const currentOrder = currentOrderRes.rows[0];

    if (!currentOrder) {
      console.log(`❌ ERROR: Webhook received for completely unknown ID: ${external_id}`);
      return res.status(200).send("OK");
    }

    console.log(`📦 Found Order: ${currentOrder.id} (Current Status: ${currentOrder.status})`);

    // If already paid or beyond, skip
    if (['PAID', 'ROASTING', 'READY_TO_SHIP', 'SHIPPED', 'DELIVERED'].includes(currentOrder.status)) {
      console.log(`ℹ️ Order ${currentOrder.id} already processed. Skipping.`);
      return res.status(200).send("OK");
    }

    // 1. Update status to PAID if payment is completed/settled
    if (status === 'PAID' || status === 'SETTLED') {
      await query(
        "UPDATE orders SET status = 'PAID', updated_at = CURRENT_TIMESTAMP WHERE xendit_invoice_id = $1",
        [external_id]
      );

      console.log(`✅ Order ${currentOrder.id} status updated to PAID via Webhook.`);
      publishEvent('orders', 'order_updated', { id: currentOrder.id, status: 'PAID' });
      await sendOrderNotification(currentOrder.id, currentOrder.customer_name, currentOrder.customer_email, currentOrder.customer_phone);

      // --- INVENTORY SYNC ---
      try {
        const itemsRes = await query("SELECT product_id, variant_weight, quantity FROM order_items WHERE order_id = $1 AND product_id IS NOT NULL", [currentOrder.id]);
        
        for (const item of itemsRes.rows) {
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
            await query(
              "UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2",
              [deductionUnits, item.product_id]
            );
            console.log(`📦 Inventory Sync: Deducted ${deductionUnits} units (250g/unit) from product ${item.product_id}`);
          }
        }
      } catch (invError) {
        console.error('❌ Inventory Sync Error:', invError);
      }
      // ----------------------

      // --- BITESHIP CONFIRMATION ---
      if (currentOrder.biteship_order_id) {
        try {
          console.log(`🔔 Confirming Biteship Draft: ${currentOrder.biteship_order_id}`);
          const confirmRes = await axios.post(`${BITESHIP_URL}/draft_orders/${currentOrder.biteship_order_id}/confirm`, {}, { headers: biteshipHeaders });
          console.log('📦 Biteship Confirm Response:', JSON.stringify(confirmRes.data, null, 2));
          
          const finalOrderId = confirmRes.data.id;
          const waybillId = confirmRes.data.courier.waybill_id;
          
          // Biteship dashboard provides the functional label route
          const labelUrl = confirmRes.data.label_url || 
                           confirmRes.data.courier?.label_url || 
                           `https://dashboard.biteship.com/labels/${finalOrderId}`;

          await query(
            "UPDATE orders SET biteship_order_id = $1, shipping_awb = $2, shipping_label_url = $3, status = 'READY_TO_SHIP' WHERE xendit_invoice_id = $4",
            [finalOrderId, waybillId, labelUrl, external_id]
          );
          console.log(`✅ Biteship Order Confirmed. Resi: ${waybillId} | Label: ${labelUrl}`);
          publishEvent('orders', 'order_updated', { id: currentOrder.id, status: 'READY_TO_SHIP', awb: waybillId });
        } catch (bsError) {
          console.error('❌ Biteship Confirm Error:', bsError.response?.data || bsError.message);
        }
      }
      // ----------------------------

      // 2. Generate PDF Invoice automatically
      await generateInvoicePDF(currentOrder.id);

    } else if (status === 'EXPIRED') {
      await query(
        "UPDATE orders SET status = 'CANCELLED', updated_at = CURRENT_TIMESTAMP WHERE xendit_invoice_id = $1",
        [external_id]
      );
      console.log(`❌ Order with invoice ${external_id} marked as CANCELLED via Webhook.`);
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error('Webhook Processing Error:', error);
    res.status(500).send("Internal Server Error");
  }
};

