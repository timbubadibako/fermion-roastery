import { Xendit } from 'xendit-node';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../lib/db.js';
import { generateInvoicePDF } from '../lib/pdfGenerator.js';

dotenv.config();

const xendit = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY,
});

export const createInvoice = async (req, res) => {
  const { amount, items, customerDetails, metadata } = req.body;
  const shipping = metadata?.shipping || {};
  const profileId = metadata?.profileId || null;
  const shippingFee = metadata?.shippingFee || 0;

  try {
    const referenceId = `invoice-${uuidv4()}`;

    // 1. Save to Database (UNPAID)
    await query('BEGIN');

    // Insert into orders
    const orderResult = await query(
      `INSERT INTO orders (
        profile_id, xendit_invoice_id, status, total_amount, shipping_fee, 
        customer_name, customer_email, customer_phone, 
        shipping_address, shipping_city, shipping_notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
      [
        profileId, referenceId, 'UNPAID', amount, shippingFee,
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
      const nameParts = item.name.match(/(.*)\s\((.*?)\)/);
      const cleanName = nameParts ? nameParts[1].trim() : item.name;
      const weight = nameParts ? nameParts[2] : '250g';

      await query(
        `INSERT INTO order_items (order_id, product_name, variant_weight, variant_grind, quantity, unit_price)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [orderId, cleanName, weight, 'Whole Bean', item.quantity, item.price]
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
  const { amount, planName, customerDetails, interval, intervalCount } = req.body;

  try {
    const referenceId = `sub-${uuidv4()}`;
    const data = {
      externalId: referenceId,
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
    console.error('Xendit Subscription Error:', error);
    res.status(500).json({ message: "Failed to create subscription", error: error.message });
  }
};
export const handleNotification = async (req, res) => {
  console.log("Xendit Payment Notification Received:", req.body);

  const { external_id, status } = req.body;

  try {
    // 0. Idempotency Check: Get current status
    const currentOrderRes = await query("SELECT status, id FROM orders WHERE xendit_invoice_id = $1", [external_id]);
    const currentOrder = currentOrderRes.rows[0];

    if (!currentOrder) {
      console.log(`⚠️ Webhook received for unknown invoice: ${external_id}`);
      return res.status(200).send("OK"); // Respond OK to Xendit to stop retries
    }

    // If already paid or beyond, skip
    if (['PAID', 'ROASTING', 'READY_TO_SHIP', 'SHIPPED', 'DELIVERED'].includes(currentOrder.status)) {
      console.log(`ℹ️ Order ${currentOrder.id} already processed (Status: ${currentOrder.status}). Skipping.`);
      return res.status(200).send("OK");
    }

    // 1. Update status to PAID if payment is completed/settled
    if (status === 'PAID' || status === 'SETTLED') {
      await query(
        "UPDATE orders SET status = 'PAID', updated_at = CURRENT_TIMESTAMP WHERE xendit_invoice_id = $1",
        [external_id]
      );

      console.log(`✅ Order ${currentOrder.id} status updated to PAID via Webhook.`);

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

