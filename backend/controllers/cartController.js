import { supabase } from '../lib/supabase.js';

// 1. Sync / Save Cart
export const syncCart = async (req, res) => {
  const { profileId, items } = req.body;

  if (!profileId) return res.status(400).json({ message: "Profile ID required" });

  try {
    // Clear existing cart for this user
    const { error: deleteError } = await supabase
      .from('cart_items')
      .delete()
      .eq('profile_id', profileId);

    if (deleteError) throw deleteError;

    if (items.length > 0) {
      const cartData = items.map(item => ({
        id: item.lineItemId,
        profile_id: profileId,
        product_id: item.id,
        weight: item.weight,
        grind: item.grind,
        quantity: item.quantity,
        selected: item.selected ?? true,
        updated_at: new Date().toISOString()
      }));

      const { error: insertError } = await supabase
        .from('cart_items')
        .insert(cartData);

      if (insertError) throw insertError;
    }

    res.status(200).json({ message: "Cart synced successfully" });
  } catch (error) {
    console.error('Sync Cart Error:', error);
    res.status(500).json({ message: "Failed to sync cart", error: error.message });
  }
};

// 2. Load Cart
export const getCart = async (req, res) => {
  const { profileId } = req.query;

  if (!profileId) return res.status(400).json({ message: "Profile ID required" });

  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        product_id,
        weight,
        grind,
        quantity,
        selected,
        products!inner (
          name,
          price_retail,
          image_url
        )
      `)
      .eq('profile_id', profileId);

    if (error) throw error;

    const formattedData = data.map(item => ({
      lineItemId: item.id,
      id: item.product_id,
      name: item.products?.name,
      price: item.products?.price_retail,
      weight: item.weight,
      grind: item.grind,
      quantity: item.quantity,
      selected: item.selected,
      image: item.products?.image_url
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.error('Get Cart Error:', error);
    res.status(500).json({ message: "Failed to fetch cart", error: error.message });
  }
};
