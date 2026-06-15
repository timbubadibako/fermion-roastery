import axios from 'axios';
import dotenv from 'dotenv';
import { query } from '../lib/db.js';

dotenv.config();

const BITESHIP_API_KEY = process.env.BITESHIP_API_KEY;
const BITESHIP_URL = 'https://api.biteship.com/v1';

const headers = {
  'Authorization': `Bearer ${BITESHIP_API_KEY}`,
  'Content-Type': 'application/json'
};

// Default Origin (Fermion Roastery Cirebon - Kesambi)
const ORIGIN_DETAILS = {
  area_id: "IDNP9IDNC105IDND151IDZ45131",
  postal_code: 45131
};

/**
 * Search for areas using Biteship Maps API
 */
export const searchAreas = async (req, res) => {
  const { input } = req.query;

  if (!input || input.length < 3) {
    return res.status(200).json([]);
  }

  try {
    const response = await axios.get(`${BITESHIP_URL}/maps/areas`, {
      headers,
      params: {
        countries: 'ID',
        input: input,
        type: 'single'
      }
    });

    res.status(200).json(response.data.areas || []);
  } catch (error) {
    console.error('Biteship Area Search Error:', error.response?.data || error.message);
    res.status(500).json({ message: "Failed to search areas", error: error.message });
  }
};

/**
 * Get shipping rates from Biteship
 */
export const getRates = async (req, res) => {
  const { destination_area_id, destination_postal_code, items } = req.body;

  if (!destination_area_id && !destination_postal_code) {
    return res.status(400).json({ message: "Destination area ID or postal code is required" });
  }

  try {
    const payload = {
      origin_area_id: ORIGIN_DETAILS.area_id,
      origin_postal_code: ORIGIN_DETAILS.postal_code,
      couriers: "jne,sicepat,jnt,anteraja,tiki,pos,ninja",
      items: items.map(item => ({
        name: item.name,
        description: item.description || item.name,
        value: Number(item.price) * Number(item.quantity),
        quantity: Number(item.quantity),
        weight: Number(item.weight) || 250,
        length: 10,
        width: 10,
        height: 10
      }))
    };

    if (destination_area_id) payload.destination_area_id = destination_area_id;
    if (destination_postal_code) payload.destination_postal_code = Number(destination_postal_code);

    console.log('📦 Fetching Rates with payload:', JSON.stringify(payload, null, 2));

    const response = await axios.post(`${BITESHIP_URL}/rates/couriers`, payload, { headers });
    
    res.status(200).json(response.data.pricing || []);
  } catch (error) {
    console.error('Biteship Rates Error:', JSON.stringify(error.response?.data, null, 2) || error.message);
    res.status(500).json({ 
      message: "Failed to fetch shipping rates", 
      error: error.response?.data?.error || error.message 
    });
  }
};

/**
 * Get real-time tracking history from our local database (Cached from webhooks)
 */
export const getTracking = async (req, res) => {
  const { id } = req.params; // internal order_id

  try {
    const result = await query(
      `SELECT status, note, updated_at 
       FROM tracking_history 
       WHERE order_id = $1 OR order_id::text IN (SELECT id::text FROM orders WHERE biteship_order_id = $1 OR shipping_awb = $1)
       ORDER BY updated_at DESC`,
      [id]
    );
    res.status(200).json({ history: result.rows });
  } catch (error) {
    console.error('Local Tracking Fetch Error:', error);
    res.status(500).json({ message: "Failed to fetch tracking info" });
  }
};

/**
 * Handle Webhook from Biteship for tracking updates
 */
export const handleBiteshipWebhook = async (req, res) => {
  console.log('🚚 Biteship Webhook Received:', JSON.stringify(req.body, null, 2));

  const { event, order_id, status, courier, note } = req.body;
  const waybill_id = courier?.waybill_id;

  try {
    // 1. Find the internal order ID
    const orderLookup = await query(
      "SELECT id FROM orders WHERE biteship_order_id = $1 OR shipping_awb = $2",
      [order_id, waybill_id]
    );

    if (orderLookup.rows.length === 0) {
      console.log(`⚠️ Webhook received for unknown order: ${order_id} / ${waybill_id}`);
      return res.status(200).send('OK');
    }

    const internalOrderId = orderLookup.rows[0].id;

    // 2. Save history event
    await query(
      "INSERT INTO tracking_history (order_id, status, note, updated_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)",
      [internalOrderId, status, note || `Status updated to ${status}`]
    );

    // 3. Mapping status Biteship ke status Database utama kita
    let newStatus = null;

    switch (status) {
      case 'picked_up':
      case 'dropping_off':
      case 'picked':
        newStatus = 'SHIPPED';
        break;
      case 'delivered':
        newStatus = 'DELIVERED';
        break;
      case 'cancelled':
      case 'rejected':
        newStatus = 'CANCELLED';
        break;
      case 'returned':
        newStatus = 'RETURNED';
        break;
    }

    if (newStatus) {
      await query(
        "UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
        [newStatus, internalOrderId]
      );
      console.log(`✅ Order ${internalOrderId} updated to ${newStatus} and history recorded.`);
    } else {
      console.log(`ℹ️ History recorded for order ${internalOrderId}, status ${status} (No main status update).`);
    }

    res.status(200).send('Webhook Processed');
  } catch (error) {
    console.error('❌ Biteship Webhook Error:', error);
    res.status(500).send('Internal Server Error');
  }
};
