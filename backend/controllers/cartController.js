import { supabase } from '../lib/supabase.js';
import { createSignedAssetUrl } from '../lib/storage.js';
import crypto from 'crypto';

const parseWeightToKg = (value) => {
  if (value == null) return 1;
  const raw = String(value).trim().toLowerCase();
  const numeric = Number(raw.replace(/[^\d.]/g, ''));

  if (!Number.isFinite(numeric) || numeric <= 0) return 1;
  if (raw.includes('kg')) return numeric;
  return numeric / 1000;
};

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
      const requestedProductIds = Array.from(
        new Set(
          items
            .map((item) => item.id)
            .filter(Boolean)
        )
      );

      const { data: existingProducts, error: productLookupError } = await supabase
        .from('products')
        .select('id')
        .in('id', requestedProductIds);

      if (productLookupError) throw productLookupError;

      const existingProductIds = new Set((existingProducts || []).map((product) => product.id));

      const validItems = items.filter((item) => existingProductIds.has(item.id));
      const removedItemIds = items
        .filter((item) => item.id && !existingProductIds.has(item.id))
        .map((item) => item.id);

      const cartData = validItems.map(item => ({
        id: item.lineItemId || crypto.randomUUID(),
        profile_id: profileId,
        product_id: item.id,
        weight: item.weight,
        grind: item.grind,
        quantity: item.quantity,
        selected: item.selected ?? true
      }));

      if (cartData.length > 0) {
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert(cartData);

        if (insertError) throw insertError;
      }

      return res.status(200).json({
        message: "Cart synced successfully",
        removedItemIds,
      });
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
    // 1. Cek B2B Tier dari user (jika ada)
    const { data: b2bData } = await supabase
      .from('b2b_partners')
      .select('tier_name')
      .eq('profile_id', profileId)
      .single();

    const userTier = b2bData?.tier_name || 'Retail'; // Default Retail

    // 2. Ambil data keranjang beserta kategori produk
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
          image_url,
          category
        )
      `)
      .eq('profile_id', profileId);

    if (error) throw error;

    const formattedData = await Promise.all(data.map(async (item) => {
      const basePrice = item.products?.price_retail || 0;
      const category = (item.products?.category || '').toLowerCase(); // 'espresso' atau 'filter'
      let finalPrice = basePrice;

      // Hitung Diskon B2B
      if (userTier === 'Bronze') {
        if (category === 'espresso') {
          // Diskon Rp 10.000 per kg
          const weightKg = parseWeightToKg(item.weight);

          finalPrice = basePrice - (10000 * weightKg);
        } else if (category === 'filter') {
          // Diskon 10%
          finalPrice = basePrice * 0.90;
        }
      } else if (userTier === 'Silver') {
        if (category === 'espresso') {
          // Diskon Rp 15.000 per kg
          const weightKg = parseWeightToKg(item.weight);
          finalPrice = basePrice - (15000 * weightKg);
        } else if (category === 'filter') {
          // Diskon 15%
          finalPrice = basePrice * 0.85;
        }
      }
      // Untuk 'Gold' atau 'Retail', harga tetap basePrice (sementara dikosongkan/sama dengan retail)

      if (finalPrice < 0) finalPrice = 0;

      return {
        lineItemId: item.id,
        id: item.product_id,
        name: item.products?.name,
        price: finalPrice, // Harga setelah diskon tier
        originalPrice: basePrice, // Harga retail asli
        category: item.products?.category,
        weight: item.weight,
        grind: item.grind,
        quantity: item.quantity,
        selected: item.selected,
        image: await createSignedAssetUrl(item.products?.image_url),
        tier: userTier
      };
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.error('Get Cart Error:', error);
    res.status(500).json({ message: "Failed to fetch cart", error: error.message });
  }
};
