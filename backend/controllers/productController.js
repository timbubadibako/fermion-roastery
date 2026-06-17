import { query } from '../lib/db.js';

/**
 * Get all products with dynamic tiered pricing
 */
export const getAllProducts = async (req, res) => {
  const profileId = req.query.profileId; 

  try {
    const result = await query('SELECT * FROM products WHERE is_active = true ORDER BY created_at DESC');
    let products = result.rows;

    let partner = null;

    if (profileId) {
      const partnerRes = await query('SELECT status, tier_name FROM b2b_partners WHERE profile_id = $1', [profileId]);
      partner = partnerRes.rows[0];
    }

    const resolvedProducts = products.map(product => {
      const retailPrice = parseFloat(product.price_retail);
      let finalPrice = retailPrice;
      let priceType = 'retail';
      let discountAmount = 0;

      if (partner) {
        // Tiered logic from Spec V2
        if (partner.tier_name === 'Silver') {
          discountAmount = 15000;
          priceType = 'tier_silver';
        } else if (partner.tier_name === 'Bronze' || partner.status === 'approved') {
          discountAmount = 10000;
          priceType = 'tier_bronze';
        } else if (partner.status === 'pending' || partner.status === 'onboarding') {
          // Introductory discount for applicants
          discountAmount = 5000; 
          priceType = 'introductory';
        }
        
        finalPrice = Math.max(0, retailPrice - discountAmount);
      }

      return {
        ...product,
        image: product.image_url || "https://placehold.co/800x1000/7a9cff/ffffff?text=FERMION+COFFEE",
        price: finalPrice,
        original_price: retailPrice,
        priceType,
        isLocked: false
      };
    });

    res.status(200).json(resolvedProducts);
  } catch (error) {
    console.error('GetAllProducts Error:', error);
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

/**
 * Get single product detail
 */
export const getProductById = async (req, res) => {
  const { id } = req.params;
  const profileId = req.query.profileId;

  try {
    const result = await query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = result.rows[0];
    const retailPrice = parseFloat(product.price_retail);
    let finalPrice = retailPrice;
    let priceType = 'retail';
    let discountAmount = 0;

    if (profileId) {
      const partnerRes = await query('SELECT status, tier_name FROM b2b_partners WHERE profile_id = $1', [profileId]);
      const partner = partnerRes.rows[0];

      if (partner) {
        if (partner.tier_name === 'Silver') {
          discountAmount = 15000;
          priceType = 'tier_silver';
        } else if (partner.tier_name === 'Bronze' || partner.status === 'approved') {
          discountAmount = 10000;
          priceType = 'tier_bronze';
        } else if (partner.status === 'pending' || partner.status === 'onboarding') {
          discountAmount = 5000;
          priceType = 'introductory';
        }
        finalPrice = Math.max(0, retailPrice - discountAmount);
      }
    }
    
    res.status(200).json({
      ...product,
      image: product.image_url || "https://placehold.co/800x1000/7a9cff/ffffff?text=FERMION+COFFEE",
      price: finalPrice,
      original_price: retailPrice,
      priceType,
      isLocked: false
    });
  } catch (error) {
    console.error('GetProductById Error:', error);
    res.status(500).json({ message: "Error fetching product details", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  const { 
    name, slug, notes, origin, process, altitude, price_retail, roast_profile, 
    description, farm, image_url, fermentation, sweetness, acidity, body, 
    stock_quantity, linked_journal_id
  } = req.body;
  
  try {
    const result = await query(
      `INSERT INTO products (
        name, slug, notes, origin, process, altitude, price_retail, roast_profile, 
        description, farm, image_url, fermentation, sweetness, acidity, body, 
        stock_quantity, linked_journal_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) 
      RETURNING *`,
      [name, slug, notes, origin, process, altitude, price_retail, roast_profile, description, farm, image_url, fermentation, sweetness, acidity, body, stock_quantity, linked_journal_id || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Failed to create product", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const bodyFields = req.body;
  
  const validColumns = [
    'name', 'slug', 'notes', 'origin', 'process', 'altitude', 
    'price_retail', 'discount_percent', 'roast_profile', 'description', 
    'farm', 'image_url', 'fermentation', 'sweetness', 'acidity', 
    'body', 'stock_quantity', 'is_active', 'linked_journal_id'
  ];

  const filteredFields = Object.keys(bodyFields)
    .filter(key => validColumns.includes(key))
    .reduce((obj, key) => {
      obj[key] = bodyFields[key];
      return obj;
    }, {});

  const keys = Object.keys(filteredFields);
  const values = Object.values(filteredFields);
  
  if (keys.length === 0) return res.status(400).json({ message: "No valid fields to update" });

  try {
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    const result = await query(
      `UPDATE products SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Failed to update product", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM products WHERE id = $1', [id]);
    res.status(200).json({ message: "Product deleted", id });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
};
