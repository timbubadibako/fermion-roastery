import { supabase } from '../lib/supabase.js';

/**
 * Get all products with dynamic tiered pricing
 */
export const getAllProducts = async (req, res) => {
  const profileId = req.query.profileId; 

  try {
    const { data: products, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (productError) throw productError;

    let partner = null;

    if (profileId) {
      const { data: partnerData, error: partnerError } = await supabase
        .from('b2b_partners')
        .select('status, tier_name')
        .eq('profile_id', profileId)
        .single();
      
      if (!partnerError) {
        partner = partnerData;
      }
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
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (productError || !product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const retailPrice = parseFloat(product.price_retail);
    let finalPrice = retailPrice;
    let priceType = 'retail';
    let discountAmount = 0;

    if (profileId) {
      const { data: partner, error: partnerError } = await supabase
        .from('b2b_partners')
        .select('status, tier_name')
        .eq('profile_id', profileId)
        .single();

      if (!partnerError && partner) {
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
    stock_quantity, linked_journal_id, category, sub_category
  } = req.body;
  
  // Sanitize fields: empty strings to null
  const sanitize = (val) => (val === "" ? null : val);

  try {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name,
        slug,
        notes: sanitize(notes),
        origin: sanitize(origin),
        process: sanitize(process),
        altitude: sanitize(altitude),
        price_retail,
        roast_profile,
        description: sanitize(description),
        farm: sanitize(farm),
        image_url: sanitize(image_url),
        fermentation: sanitize(fermentation),
        sweetness,
        acidity,
        body,
        stock_quantity,
        linked_journal_id: sanitize(linked_journal_id),
        category,
        sub_category
      }])
      .select()
      .single();

    if (error) {
      console.error("DEBUG: Supabase error:", error);
      throw error;
    }
    res.status(201).json(data);
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
    'body', 'stock_quantity', 'is_active', 'linked_journal_id', 'category', 'sub_category'
  ];

  const filteredFields = Object.keys(bodyFields)
    .filter(key => validColumns.includes(key))
    .reduce((obj, key) => {
      obj[key] = bodyFields[key];
      return obj;
    }, {});

  if (Object.keys(filteredFields).length === 0) {
    return res.status(400).json({ message: "No valid fields to update" });
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .update(filteredFields)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to update product", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(200).json({ message: "Product deleted", id });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
};

export const uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = req.file;
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { data, error } = await supabase.storage
      .from('images') // Assumes 'images' bucket exists
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });

    if (error) {
        // Fallback: If 'images' bucket doesn't exist, try 'products'
        const { data: dataAlt, error: errorAlt } = await supabase.storage
            .from('products')
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: true
            });
        
        if (errorAlt) throw errorAlt;
        
        const { data: { publicUrl } } = supabase.storage
            .from('products')
            .getPublicUrl(filePath);
            
        return res.status(200).json({ url: publicUrl });
    }

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    res.status(200).json({ url: publicUrl });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};
