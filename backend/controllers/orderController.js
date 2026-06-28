import { supabase } from '../lib/supabase.js';
import { generateInvoicePDF } from '../lib/pdfGenerator.js';

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
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
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
    console.error('Error fetching order detail:', error);
    res.status(500).json({ message: "Failed to fetch order detail", error: error.message });
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
    console.error('Error downloading order invoice:', error);
    res.status(500).json({ message: "Failed to download invoice", error: error.message });
  }
};
