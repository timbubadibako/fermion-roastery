import axios from 'axios';
import dotenv from 'dotenv';

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
 * Handle Webhook from Biteship for tracking updates
 */
import { query } from '../lib/db.js';

export const handleBiteshipWebhook = async (req, res) => {
  console.log('🚚 Biteship Webhook Received:', JSON.stringify(req.body, null, 2));

  const { event, order_id, status, courier } = req.body;
  const waybill_id = courier?.waybill_id;

  try {
    // Mapping status Biteship ke status Database kita
    let newStatus = null;

    switch (status) {
      case 'picked_up':
      case 'dropping_off':
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
      default:
        console.log(`ℹ️ Status ${status} ignored (No mapping).`);
    }

    if (newStatus) {
      // Cari order berdasarkan biteship_order_id ATAU waybill_id (resi)
      const updateRes = await query(
        `UPDATE orders 
         SET status = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE biteship_order_id = $2 OR shipping_awb = $3
         RETURNING id`,
        [newStatus, order_id, waybill_id]
      );

      if (updateRes.rows.length > 0) {
        console.log(`✅ Order ${updateRes.rows[0].id} updated to ${newStatus} via Biteship Webhook.`);
      } else {
        console.log(`⚠️ Webhook received for order ${order_id} / ${waybill_id} but not found in database.`);
      }
    }

    res.status(200).send('Webhook Processed');
  } catch (error) {
    console.error('❌ Biteship Webhook Error:', error);
    res.status(500).send('Internal Server Error');
  }
};
