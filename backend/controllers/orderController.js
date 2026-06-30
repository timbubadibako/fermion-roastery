import { supabase } from '../lib/supabase.js';
import { generateInvoicePDF } from '../lib/pdfGenerator.js';
import { logError } from '../lib/logger.js';
import { sanitizeError } from '../lib/security.js';
import { verifyGuestTrackingToken } from '../lib/trackingToken.js';

const FINAL_PUBLIC_TRACKING_STATUSES = new Set(['DELIVERED', 'RETURNED', 'CANCELLED']);

const getRequestRole = async (userId) => {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return profile?.role || 'RETAIL';
};

const getAuthorizedOrder = async (orderId, userId) => {
  const role = await getRequestRole(userId);
  let query = supabase
    .from('orders')
    .select('id, profile_id')
    .eq('id', orderId);

  if (role !== 'ADMIN') {
    query = query.eq('profile_id', userId);
  }

  const { data, error } = await query.single();

  if (error || !data) {
    return null;
  }

  return { order: data, role };
};

const getOrderWithItems = async (orderId) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(id, name:product_name, quantity, price:unit_price, weight:variant_weight, grind:variant_grind)')
    .eq('id', orderId)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
};

const getTrackingHistory = async (orderId) => {
  const { data } = await supabase
    .from('tracking_history')
    .select('status, note, updated_at')
    .eq('order_id', orderId)
    .order('updated_at', { ascending: false });

  return data || [];
};

const resolvePublicOrder = async (token) => {
  const verified = verifyGuestTrackingToken(token);

  if (!verified.valid) {
    return { status: 401, body: { message: 'Tracking token tidak valid.' } };
  }

  const order = await getOrderWithItems(verified.payload.orderId);
  if (!order) {
    return { status: 404, body: { message: 'Pesanan tidak ditemukan.' } };
  }

  if (String(order.customer_email || '').trim().toLowerCase() !== verified.payload.customerEmail) {
    return { status: 401, body: { message: 'Tracking token tidak cocok.' } };
  }

  if (FINAL_PUBLIC_TRACKING_STATUSES.has(order.status)) {
    return {
      status: 410,
      body: {
        message: 'Tautan tracking ini sudah kedaluwarsa karena pesanan telah selesai.',
        status: order.status,
      },
    };
  }

  return { status: 200, order };
};

// 1. Get User's Own Orders
export const getMyOrders = async (req, res) => {
  const profileId = req.user?.id;

  if (!profileId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(id, name:product_name, quantity, price:unit_price, weight:variant_weight, grind:variant_grind)')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    res.status(200).json(data);
  } catch (error) {
    logError('orders.mine.fetch_failed', error, { profileId });
    res.status(500).json(sanitizeError(error, "Failed to fetch orders"));
  }
};

// 2. Get Single Order Detail (for Tracking)
export const getOrderDetail = async (req, res) => {
  const { id } = req.params;
  const profileId = req.user?.id;

  if (!profileId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const authorized = await getAuthorizedOrder(id, profileId);
    const role = authorized?.role;

    if (!role) {
      return res.status(404).json({ message: "Order not found" });
    }

    let query = supabase
      .from('orders')
      .select('*, items:order_items(id, name:product_name, quantity, price:unit_price, weight:variant_weight, grind:variant_grind)')
      .eq('id', id);

    if (role !== 'ADMIN') {
      query = query.eq('profile_id', profileId);
    }

    const { data, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: "Order not found" });
      }
      throw error;
    }

    res.status(200).json(data);
  } catch (error) {
    logError('orders.detail.fetch_failed', error, { orderId: id, profileId });
    res.status(500).json(sanitizeError(error, "Failed to fetch order detail"));
  }
};

export const downloadOrderInvoice = async (req, res) => {
  const { id } = req.params;
  const profileId = req.user?.id;

  if (!profileId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const authorized = await getAuthorizedOrder(id, profileId);

    if (!authorized?.order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const { order } = authorized;
    const generated = await generateInvoicePDF(order.id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${generated.fileName}"`);
    return res.send(generated.buffer);
  } catch (error) {
    logError('orders.invoice.download_failed', error, { orderId: id, profileId });
    res.status(500).json(sanitizeError(error, "Failed to download invoice"));
  }
};

export const getPublicOrderTracking = async (req, res) => {
  try {
    const resolved = await resolvePublicOrder(req.params.token);
    if (resolved.status !== 200) {
      return res.status(resolved.status).json(resolved.body);
    }

    const history = await getTrackingHistory(resolved.order.id);

    return res.status(200).json({
      id: resolved.order.id,
      status: resolved.order.status,
      customer_name: resolved.order.customer_name,
      customer_email: resolved.order.customer_email,
      customer_phone: resolved.order.customer_phone,
      shipping_address: resolved.order.shipping_address,
      shipping_city: resolved.order.shipping_city,
      shipping_courier: resolved.order.shipping_courier,
      shipping_awb: resolved.order.shipping_awb,
      shipping_fee: resolved.order.shipping_fee,
      total_amount: resolved.order.total_amount,
      created_at: resolved.order.created_at,
      updated_at: resolved.order.updated_at,
      items: resolved.order.items || [],
      tracking_history: history,
    });
  } catch (error) {
    logError('orders.public_tracking.failed', error, { token: req.params.token });
    return res.status(500).json(sanitizeError(error, 'Failed to fetch public tracking'));
  }
};

export const downloadPublicOrderInvoice = async (req, res) => {
  try {
    const resolved = await resolvePublicOrder(req.params.token);
    if (resolved.status !== 200) {
      return res.status(resolved.status).json(resolved.body);
    }

    const generated = await generateInvoicePDF(resolved.order.id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${generated.fileName}"`);
    return res.send(generated.buffer);
  } catch (error) {
    logError('orders.public_invoice.download_failed', error, { token: req.params.token });
    return res.status(500).json(sanitizeError(error, 'Failed to download public invoice'));
  }
};
