import { query } from '../lib/db.js';

export const getAllProducts = async (req, res) => {
  try {
    // Basic query to fetch all products
    // In the future, we will join with pricing_tiers based on user role
    const result = await query('SELECT * FROM products WHERE is_active = true ORDER BY created_at DESC');
    
    // Logic for "Introductory Discount" for B2B Pending could be added here
    // For now, we return the base retail price and discount_percent
    const products = result.rows.map(product => ({
      ...product,
      image: product.image_url || "https://placehold.co/800x1000/7a9cff/ffffff?text=FERMION+COFFEE", // Fallback for missing images
      price: parseFloat(product.price_retail), 
    }));

    res.status(200).json(products);
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ message: "Error fetching products from database", error: error.message });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = result.rows[0];
    
    // Fetch pricing tiers for this product
    const tiersResult = await query('SELECT tier_name, unit_price FROM pricing_tiers WHERE product_id = $1', [id]);
    
    res.status(200).json({
      ...product,
      image: product.image_url || "https://placehold.co/800x1000/7a9cff/ffffff?text=FERMION+COFFEE",
      price: parseFloat(product.price_retail),
      pricing_tiers: tiersResult.rows
    });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ message: "Error fetching product details", error: error.message });
  }
};
