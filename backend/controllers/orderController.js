import { supabase } from '../lib/supabase.js';

// 1. Get User's Own Orders
export const getMyOrders = async (req, res) => {
  const { profileId } = req.query;

  if (!profileId) {
    return res.status(400).json({ message: "Profile ID is required" });
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
  const { profileId } = req.query;

  try {
    let query = supabase
      .from('orders')
      .select('*, items:order_items(id, name:product_name, quantity, price:unit_price, weight:variant_weight, grind:variant_grind)')
      .eq('id', id);

    if (profileId) {
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
