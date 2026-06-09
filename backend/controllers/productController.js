import { query } from '../lib/db.js';

export const getAllProducts = async (req, res) => {
  const profileId = req.query.profileId; 

  try {
    const result = await query('SELECT * FROM products WHERE is_active = true ORDER BY created_at DESC');
    let products = result.rows;

    let partner = null;
    let contractsMap = {};
    let tiersMap = {};

    if (profileId) {
      const partnerRes = await query('SELECT status, tier_name FROM b2b_partners WHERE profile_id = $1', [profileId]);
      partner = partnerRes.rows[0];

      if (partner) {
        const contractsRes = await query(
          'SELECT product_id, fixed_price FROM contracts WHERE profile_id = $1 AND start_date <= CURRENT_DATE AND end_date >= CURRENT_DATE', 
          [profileId]
        );
        contractsMap = contractsRes.rows.reduce((acc, curr) => { 
          acc[curr.product_id] = curr.fixed_price; 
          return acc; 
        }, {});

        if (partner.status === 'approved' && partner.tier_name) {
          const tiersRes = await query(
            'SELECT product_id, unit_price FROM pricing_tiers WHERE tier_name = $1', 
            [partner.tier_name]
          );
          tiersMap = tiersRes.rows.reduce((acc, curr) => { 
            acc[curr.product_id] = curr.unit_price; 
            return acc; 
          }, {});
        }
      }
    }

    const resolvedProducts = products.map(product => {
      let finalPrice = parseFloat(product.price_retail);
      let priceType = 'retail';
      let isLocked = false;

      if (partner) {
        if (contractsMap[product.id]) {
          finalPrice = parseFloat(contractsMap[product.id]);
          priceType = 'contract';
          isLocked = true;
        } else if (partner.status === 'approved' && partner.tier_name && tiersMap[product.id]) {
          finalPrice = parseFloat(tiersMap[product.id]);
          priceType = 'tier';
        } else if (partner.status === 'pending') {
          const discount = product.discount_percent > 0 ? product.discount_percent : 10;
          finalPrice = finalPrice * (1 - (discount / 100));
          priceType = 'introductory';
        }
      }

      return {
        ...product,
        image: product.image_url || "https://placehold.co/800x1000/7a9cff/ffffff?text=FERMION+COFFEE",
        price: finalPrice,
        original_price: parseFloat(product.price_retail),
        priceType,
        isLocked
      };
    });

    res.status(200).json(resolvedProducts);
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ message: "Error fetching products from database", error: error.message });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  const profileId = req.query.profileId;

  try {
    const result = await query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = result.rows[0];
    let finalPrice = parseFloat(product.price_retail);
    let priceType = 'retail';
    let isLocked = false;

    if (profileId) {
      const partnerRes = await query('SELECT status, tier_name FROM b2b_partners WHERE profile_id = $1', [profileId]);
      const partner = partnerRes.rows[0];

      if (partner) {
        const contractRes = await query(
          'SELECT fixed_price FROM contracts WHERE profile_id = $1 AND product_id = $2 AND start_date <= CURRENT_DATE AND end_date >= CURRENT_DATE',
          [profileId, id]
        );

        if (contractRes.rows.length > 0) {
           finalPrice = parseFloat(contractRes.rows[0].fixed_price);
           priceType = 'contract';
           isLocked = true;
        } else if (partner.status === 'approved' && partner.tier_name) {
           const tierRes = await query('SELECT unit_price FROM pricing_tiers WHERE product_id = $1 AND tier_name = $2', [id, partner.tier_name]);
           if (tierRes.rows.length > 0) {
              finalPrice = parseFloat(tierRes.rows[0].unit_price);
              priceType = 'tier';
           }
        } else if (partner.status === 'pending') {
           const discount = product.discount_percent > 0 ? product.discount_percent : 10;
           finalPrice = finalPrice * (1 - (discount / 100));
           priceType = 'introductory';
        }
      }
    }
    
    const tiersResult = await query('SELECT tier_name, unit_price FROM pricing_tiers WHERE product_id = $1', [id]);
    
    res.status(200).json({
      ...product,
      image: product.image_url || "https://placehold.co/800x1000/7a9cff/ffffff?text=FERMION+COFFEE",
      price: finalPrice,
      original_price: parseFloat(product.price_retail),
      priceType,
      isLocked,
      pricing_tiers: tiersResult.rows
    });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ message: "Error fetching product details", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  const { 
    name, slug, notes, origin, process, altitude, price_retail, roast_profile, 
    description, farm, image_url, fermentation, sweetness, acidity, body, 
    stock_quantity, pricingTiers 
  } = req.body;
  
  try {
    // Start Transaction
    await query('BEGIN');

    const productResult = await query(
      `INSERT INTO products (
        name, slug, notes, origin, process, altitude, price_retail, roast_profile, 
        description, farm, image_url, fermentation, sweetness, acidity, body, stock_quantity
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) 
      RETURNING *`,
      [name, slug, notes, origin, process, altitude, price_retail, roast_profile, description, farm, image_url, fermentation, sweetness, acidity, body, stock_quantity]
    );
    
    const product = productResult.rows[0];

    // Insert Pricing Tiers if provided
    if (pricingTiers && Array.isArray(pricingTiers)) {
      for (const tier of pricingTiers) {
        await query(
          'INSERT INTO pricing_tiers (product_id, tier_name, unit_price) VALUES ($1, $2, $3)',
          [product.id, tier.tier_name, tier.unit_price]
        );
      }
    }

    await query('COMMIT');
    res.status(201).json(product);
  } catch (error) {
    await query('ROLLBACK');
    console.error('Create Product Error:', error);
    res.status(500).json({ message: "Failed to create product", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { pricingTiers, ...bodyFields } = req.body;
  
  // Whitelist of valid database columns for the products table
  const validColumns = [
    'name', 'slug', 'notes', 'origin', 'process', 'altitude', 
    'price_retail', 'discount_percent', 'roast_profile', 'description', 
    'farm', 'image_url', 'fermentation', 'sweetness', 'acidity', 
    'body', 'stock_quantity', 'is_active'
  ];

  // Filter out any virtual fields (like 'image', 'price', 'isLocked') sent by the frontend
  const filteredFields = Object.keys(bodyFields)
    .filter(key => validColumns.includes(key))
    .reduce((obj, key) => {
      obj[key] = bodyFields[key];
      return obj;
    }, {});

  const keys = Object.keys(filteredFields);
  const values = Object.values(filteredFields);
  
  try {
    await query('BEGIN');

    let updatedProduct = null;

    if (keys.length > 0) {
      const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
      const result = await query(
        `UPDATE products SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${keys.length + 1} RETURNING *`,
        [...values, id]
      );
      updatedProduct = result.rows[0];
    }

    // Update Pricing Tiers if provided
    if (pricingTiers && Array.isArray(pricingTiers)) {
      // Simple approach: delete existing and re-insert
      await query('DELETE FROM pricing_tiers WHERE product_id = $1', [id]);
      for (const tier of pricingTiers) {
        await query(
          'INSERT INTO pricing_tiers (product_id, tier_name, unit_price) VALUES ($1, $2, $3)',
          [id, tier.tier_name, tier.unit_price]
        );
      }
    }

    await query('COMMIT');
    res.status(200).json(updatedProduct || { id, message: "Tiers updated" });
  } catch (error) {
    await query('ROLLBACK');
    console.error('Update Product Error:', error);
    res.status(500).json({ message: "Failed to update product", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted", id: result.rows[0].id });
  } catch (error) {
    console.error('Delete Product Error:', error);
    res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
};
