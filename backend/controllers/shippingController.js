import axios from 'axios';
import dotenv from 'dotenv';
import { supabase } from '../lib/supabase.js';
import { generateShippingLabelsBatch } from '../lib/pdfGenerator.js';

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
    // We need to support lookup by internal order_id, biteship_order_id, or shipping_awb
    // First, find the order to get the internal ID if 'id' is a biteship ID or AWB
    const { data: order } = await supabase
      .from('orders')
      .select('id')
      .or(`id.eq.${id},biteship_order_id.eq.${id},shipping_awb.eq.${id}`)
      .maybeSingle();

    const orderId = order ? order.id : id;

    const { data, error } = await supabase
      .from('tracking_history')
      .select('status, note, updated_at')
      .eq('order_id', orderId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    res.status(200).json({ history: data });
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
    const { data: orderData, error: lookupError } = await supabase
      .from('orders')
      .select('id')
      .or(`biteship_order_id.eq.${order_id},shipping_awb.eq.${waybill_id}`)
      .maybeSingle();

    if (lookupError || !orderData) {
      console.log(`⚠️ Webhook received for unknown order: ${order_id} / ${waybill_id}`);
      return res.status(200).send('OK');
    }

    const internalOrderId = orderData.id;

    // 2. Save history event
    const { error: historyError } = await supabase
      .from('tracking_history')
      .insert([
        {
          order_id: internalOrderId,
          status,
          note: note || `Status updated to ${status}`,
          updated_at: new Date()
        }
      ]);

    if (historyError) throw historyError;

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
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date() })
        .eq('id', internalOrderId);
      
      if (updateError) throw updateError;
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

/**
 * Generate PDF Shipping Labels for a list of orders
 */
export const getBatchLabels = async (req, res) => {
  const { orderIds } = req.body; // Array of internal order IDs

  if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
    return res.status(400).json({ message: "List of order IDs is required" });
  }

  try {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=shipping-labels.pdf');
    
    await generateShippingLabelsBatch(orderIds, res);
  } catch (error) {
    console.error('Batch Label Fetch Error:', error);
    res.status(500).json({ message: "Failed to generate batch labels" });
  }
};
