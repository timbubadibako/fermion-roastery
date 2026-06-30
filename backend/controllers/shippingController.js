import axios from 'axios';
import dotenv from 'dotenv';
import { supabase } from '../lib/supabase.js';
import { generateShippingLabelsBatch } from '../lib/pdfGenerator.js';
import { logError, logInfo } from '../lib/logger.js';
import { sanitizeError, verifyStaticWebhookSecret } from '../lib/security.js';
import { getBiteshipOrigin } from '../lib/runtimeConfig.js';

dotenv.config();

const BITESHIP_API_KEY = process.env.BITESHIP_API_KEY;
const BITESHIP_URL = 'https://api.biteship.com/v1';

const headers = {
  'Authorization': `Bearer ${BITESHIP_API_KEY}`,
  'Content-Type': 'application/json'
};

// Default Origin (Fermion Roastery Cirebon - Kesambi)
const ORIGIN_DETAILS = getBiteshipOrigin();

const parseWeightToGrams = (value) => {
  if (value == null) return 250;
  const match = String(value).trim().toLowerCase().match(/(\d+(?:\.\d+)?)(g|kg)/);
  if (!match) return 250;

  const numericWeight = Number(match[1]);
  if (!Number.isFinite(numericWeight) || numericWeight <= 0) return 250;

  return match[2] === 'kg' ? numericWeight * 1000 : numericWeight;
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
    logError('shipping.areas.search_failed', error);
    res.status(500).json(sanitizeError(error, "Failed to search areas"));
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
        weight: parseWeightToGrams(item.weight),
        length: 10,
        width: 10,
        height: 10
      }))
    };

    if (destination_area_id) payload.destination_area_id = destination_area_id;
    if (destination_postal_code) payload.destination_postal_code = Number(destination_postal_code);

    const response = await axios.post(`${BITESHIP_URL}/rates/couriers`, payload, { headers });
    
    res.status(200).json(response.data.pricing || []);
  } catch (error) {
    logError('shipping.rates.fetch_failed', error);
    res.status(500).json(sanitizeError(error, "Failed to fetch shipping rates"));
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
    logError('shipping.tracking.fetch_failed', error, { id });
    res.status(500).json(sanitizeError(error, "Failed to fetch tracking info"));
  }
};

/**
 * Handle Webhook from Biteship for tracking updates
 */
export const handleBiteshipWebhook = async (req, res) => {
  const { event, order_id, status, courier, note } = req.body;
  const waybill_id = courier?.waybill_id;

  try {
    const providedSecret = req.headers['x-biteship-secret'] || req.headers['x-webhook-secret'];
    if (!verifyStaticWebhookSecret(providedSecret, process.env.BITESHIP_WEBHOOK_SECRET)) {
      return res.status(401).json({ message: 'Unauthorized webhook request' });
    }

    // 1. Find the internal order ID
    const { data: orderData, error: lookupError } = await supabase
      .from('orders')
      .select('id')
      .or(`biteship_order_id.eq.${order_id},shipping_awb.eq.${waybill_id}`)
      .maybeSingle();

    if (lookupError || !orderData) {
      logInfo('shipping.webhook.unknown_order', { order_id, waybill_id, event, status });
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
      logInfo('shipping.webhook.order_updated', { internalOrderId, newStatus, event, status });
    } else {
      logInfo('shipping.webhook.history_recorded', { internalOrderId, event, status });
    }

    res.status(200).send('Webhook Processed');
  } catch (error) {
    logError('shipping.webhook.failed', error, { order_id, status });
    res.status(500).json(sanitizeError(error, 'Internal Server Error'));
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
    logError('shipping.labels.batch_failed', error, { orderIdsCount: orderIds.length });
    res.status(500).json(sanitizeError(error, "Failed to generate batch labels"));
  }
};
