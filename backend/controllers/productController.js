import { query } from '../lib/db.js';

export const getAllProducts = async (req, res) => {
  const profileId = req.query.profileId; // Simulated auth using query param for now

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
        // 1. Fetch active contracts for this user
        const contractsRes = await query(
          'SELECT product_id, fixed_price FROM contracts WHERE profile_id = $1 AND start_date <= CURRENT_DATE AND end_date >= CURRENT_DATE', 
          [profileId]
        );
        contractsMap = contractsRes.rows.reduce((acc, curr) => { 
          acc[curr.product_id] = curr.fixed_price; 
          return acc; 
        }, {});

        // 2. Fetch tier pricing if user is approved
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

    // Process each product to determine the final price based on the hierarchy
    const resolvedProducts = products.map(product => {
      let finalPrice = parseFloat(product.price_retail);
      let priceType = 'retail';
      let isLocked = false;

      if (partner) {
        if (contractsMap[product.id]) {
          // Priority 1: Contract
          finalPrice = parseFloat(contractsMap[product.id]);
          priceType = 'contract';
          isLocked = true;
        } else if (partner.status === 'approved' && partner.tier_name && tiersMap[product.id]) {
          // Priority 2: B2B Tier
          finalPrice = parseFloat(tiersMap[product.id]);
          priceType = 'tier';
        } else if (partner.status === 'pending') {
          // Priority 3: B2B Pending (Introductory Discount)
          const discount = product.discount_percent > 0 ? product.discount_percent : 10; // Default 10% if 0
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
    
    // Fetch pricing tiers info strictly for reference/admin (optional, but keeping it)
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

