import { supabase } from '../lib/supabase.js';
import { buildStorageReference, createSignedAssetUrl, resolveSignedAssetUrls } from '../lib/storage.js';

const parseWeightToGrams = (value) => {
  if (value == null) return Number.POSITIVE_INFINITY;
  const match = String(value).trim().toLowerCase().match(/(\d+(?:\.\d+)?)(g|kg)/);
  if (!match) return Number.POSITIVE_INFINITY;

  const numericWeight = Number(match[1]);
  if (!Number.isFinite(numericWeight) || numericWeight <= 0) return Number.POSITIVE_INFINITY;

  return match[2] === 'kg' ? numericWeight * 1000 : numericWeight;
};

const applyPartnerPricing = ({ basePrice, partner, category, discountEnabled, weight }) => {
  const normalizedPrice = Number(basePrice || 0);
  const normalizedWeightInKg = (() => {
    const weightInGrams = parseWeightToGrams(weight);
    if (!Number.isFinite(weightInGrams) || weightInGrams <= 0 || weightInGrams === Number.POSITIVE_INFINITY) {
      return 1;
    }
    return weightInGrams / 1000;
  })();

  if (!partner || discountEnabled === false) {
    return Math.max(0, normalizedPrice);
  }

  const normalizedCategory = String(category || '').toLowerCase();

  if (partner.tier_name === 'Silver') {
    if (normalizedCategory === 'filter') return Math.max(0, normalizedPrice * 0.85);
    return Math.max(0, normalizedPrice - (15000 * normalizedWeightInKg));
  }

  if (partner.tier_name === 'Bronze' || partner.status === 'approved') {
    if (normalizedCategory === 'filter') return Math.max(0, normalizedPrice * 0.90);
    return Math.max(0, normalizedPrice - (10000 * normalizedWeightInKg));
  }

  if (partner.status === 'pending' || partner.status === 'onboarding') {
    return Math.max(0, normalizedPrice - (5000 * normalizedWeightInKg));
  }

  return Math.max(0, normalizedPrice);
};

const resolvePriceType = (partner, discountEnabled) => {
  if (!partner || discountEnabled === false) return 'retail';
  if (partner.tier_name === 'Silver') return 'tier_silver';
  if (partner.tier_name === 'Bronze' || partner.status === 'approved') return 'tier_bronze';
  if (partner.status === 'pending' || partner.status === 'onboarding') return 'introductory';
  return 'retail';
};

const mapProductWithResolvedVariants = (product, partner) => {
  const retailPrice = Number(product.price_retail || 0);
  const sortedVariants = Array.isArray(product.product_variants)
    ? [...product.product_variants].sort((first, second) => parseWeightToGrams(first.weight) - parseWeightToGrams(second.weight))
    : [];

  const resolvedVariants = sortedVariants.map((variant) => {
    const variantBasePrice = Number(variant.price ?? retailPrice);
    return {
      ...variant,
      original_price: variantBasePrice,
      price: applyPartnerPricing({
        basePrice: variantBasePrice,
        partner,
        category: product.category,
        discountEnabled: product.b2b_discount_enabled,
        weight: variant.weight
      })
    };
  });

  return {
    ...product,
    product_variants: resolvedVariants,
    original_price: retailPrice,
    price: resolvedVariants[0]?.price ?? applyPartnerPricing({
      basePrice: retailPrice,
      partner,
      category: product.category,
      discountEnabled: product.b2b_discount_enabled,
      weight: resolvedVariants[0]?.weight
    }),
    priceType: resolvePriceType(partner, product.b2b_discount_enabled),
    isLocked: false
  };
};

/**
 * Get all products with dynamic tiered pricing & marketing flags
 */
export const getAllProducts = async (req, res) => {
  const profileId = req.query.profileId;

  try {
    // 🟢 SUNTIKAN BARU: Masukkan flag komersial baru ke select query
    const { data: products, error: productError } = await supabase
      .from('products')
      .select('*, product_variants(*)') // Otomatis menghela seluruh data varian beratnya sekaligus
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

    const pricedProducts = products.map((product) => mapProductWithResolvedVariants(product, partner));

    const resolvedProducts = await resolveSignedAssetUrls(pricedProducts, 'image_url');
    res.status(200).json(resolvedProducts);
  } catch (error) {
    console.error('GetAllProducts Error:', error);
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

/**
 * Get single product detail with variants
 */
export const getProductById = async (req, res) => {
  const { id } = req.params;
  const profileId = req.query.profileId;

  try {
    // 🟢 SUNTIKAN BARU: Tarik relasi tabel anak product_variants
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*, product_variants(*)')
      .eq('id', id)
      .single();

    if (productError || !product) {
      return res.status(404).json({ message: "Product not found" });
    }

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

    const signedImageUrl = await createSignedAssetUrl(product.image_url);
    const resolvedProduct = mapProductWithResolvedVariants(product, partner);

    res.status(200).json({
      ...resolvedProduct,
      image_url: signedImageUrl,
      image_url_storage_path: product.image_url || null,
    });
  } catch (error) {
    console.error('GetProductById Error:', error);
    res.status(500).json({ message: "Error fetching product details", error: error.message });
  }
};

/**
 * Create Product with Nested Dynamic Variants & Marketing Flags
 */
export const createProduct = async (req, res, next) => {
  const {
    name, slug, notes, origin, process, altitude, price_retail, roast_profile,
    description, farm, image_url, fermentation, sweetness, acidity, body,
    stock_quantity, linked_journal_id, category, sub_category,
    b2b_discount_enabled, is_new_release, is_promoted, search_upsell_headline, variants // 🟢 Tangkap payload baru dari frontend
  } = req.body;

  const sanitize = (val) => (val === "" ? null : val);
  const toCurrencyNumber = (val, fallback = 0) => {
    if (typeof val === 'string') {
      const parsed = Number(val.replace(/[^\d]/g, ""));
      return Number.isFinite(parsed) ? parsed : fallback;
    }
    const parsed = Number(val);
    return Number.isFinite(parsed) ? parsed : fallback;
  };
  const toNumber = (val, fallback = 0) => {
    const parsed = Number(val);
    return Number.isFinite(parsed) ? parsed : fallback;
  };
  const toInteger = (val, fallback = 0) => {
    const parsed = parseInt(val, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  try {
    // LANGKAH 1: Masukkan data induk ke tabel products
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert([{
        name,
        slug,
        notes: sanitize(notes),
        origin: sanitize(origin),
        process: sanitize(process),
        altitude: sanitize(altitude),
        price_retail: toCurrencyNumber(price_retail),
        roast_profile,
        description: sanitize(description),
        farm: sanitize(farm),
        image_url: sanitize(image_url),
        fermentation: sanitize(fermentation),
        sweetness: toNumber(sweetness, 3),
        acidity: toNumber(acidity, 3),
        body: toNumber(body, 3),
        stock_quantity: toInteger(stock_quantity),
        linked_journal_id: sanitize(linked_journal_id),
        category,
        sub_category,
        b2b_discount_enabled: b2b_discount_enabled !== undefined ? b2b_discount_enabled : true,
        is_new_release: is_new_release || false,
        is_promoted: is_promoted || false,
        search_upsell_headline: sanitize(search_upsell_headline)
      }])
      .select()
      .single();

    if (productError) throw productError;

    // LANGKAH 2: Logika Interseptor Fallback Otomatis Varian Berat
    let finalVariants = [];
    if (variants && variants.length > 0) {
      finalVariants = variants.map(v => ({
        product_id: product.id,
        weight: v.weight.endsWith('g') ? v.weight : `${v.weight}g`, // Garansi string format '150g'
        price: toCurrencyNumber(v.price),
        stock_quantity: Number(v.stock_quantity)
      }));
    } else {
      // 🟢 Mendorong otomatis varian 150g & 250g jika dikosongkan admin
      finalVariants = [
        { product_id: product.id, weight: "150g", price: toCurrencyNumber(price_retail), stock_quantity: toInteger(stock_quantity) },
        { product_id: product.id, weight: "250g", price: Math.round(toCurrencyNumber(price_retail) * 1.6), stock_quantity: toInteger(stock_quantity) }
      ];
    }

    // LANGKAH 3: Tembak massal array varian ke tabel anak product_variants
    const { error: variantError } = await supabase
      .from('product_variants')
      .insert(finalVariants);

    if (variantError) throw variantError;

    res.status(201).json({ ...product, product_variants: finalVariants });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Product with Variants sync
 */
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const bodyFields = req.body;

  // 🟢 Tambahkan kolom validasi baru agar diizinkan lolos filtrasi update
  const validColumns = [
    'name', 'slug', 'notes', 'origin', 'process', 'altitude',
    'price_retail', 'discount_percent', 'roast_profile', 'description',
    'farm', 'image_url', 'fermentation', 'sweetness', 'acidity',
    'body', 'stock_quantity', 'is_active', 'linked_journal_id', 'category', 'sub_category',
    'b2b_discount_enabled', 'is_new_release', 'is_promoted', 'search_upsell_headline'
  ];

  const numericColumns = new Set(['price_retail', 'sweetness', 'acidity', 'body']);
  const integerColumns = new Set(['discount_percent', 'stock_quantity']);
  const nullableColumns = new Set([
    'notes', 'origin', 'process', 'altitude', 'description', 'farm',
    'image_url', 'fermentation', 'linked_journal_id', 'search_upsell_headline'
  ]);

  const sanitizeFieldValue = (key, value) => {
    if (key === 'price_retail') {
      if (typeof value === 'string') {
        const parsed = Number(value.replace(/[^\d]/g, ""));
        return Number.isFinite(parsed) ? parsed : 0;
      }
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    }

    if (integerColumns.has(key)) {
      const parsed = parseInt(value, 10);
      return Number.isFinite(parsed) ? parsed : 0;
    }

    if (numericColumns.has(key)) {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    }

    if (nullableColumns.has(key) && value === "") {
      return null;
    }

    return value;
  };

  const filteredFields = Object.keys(bodyFields)
    .filter(key => validColumns.includes(key))
    .reduce((obj, key) => {
      obj[key] = sanitizeFieldValue(key, bodyFields[key]);
      return obj;
    }, {});

  try {
    // Update data produk utama
    const { data: product, error: productError } = await supabase
      .from('products')
      .update(filteredFields)
      .eq('id', id)
      .select()
      .single();

    if (productError) throw productError;

    // Jika di body payload update membawa set array variants baru, sinkronisasikan ulang
    if (Array.isArray(bodyFields.variants)) {
      // Hapus varian lama biar tidak menumpuk duplikat
      const { error: deleteVariantError } = await supabase
        .from('product_variants')
        .delete()
        .eq('product_id', id);

      if (deleteVariantError) throw deleteVariantError;

      const finalVariants = bodyFields.variants
        .map(v => {
          const weight = String(v.weight ?? '').trim();

          return {
            product_id: id,
            weight: weight.endsWith('g') || weight.endsWith('kg') ? weight : `${weight}g`,
            price: typeof v.price === 'string' ? Number(v.price.replace(/[^\d]/g, "")) : Number(v.price),
            stock_quantity: Number(v.stock_quantity)
          };
        })
        .filter(v => v.weight !== 'g' && Number.isFinite(v.price) && Number.isFinite(v.stock_quantity));

      if (finalVariants.length > 0) {
        const { error: variantError } = await supabase.from('product_variants').insert(finalVariants);
        if (variantError) throw variantError;
      }
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('UpdateProduct Error:', error);
    res.status(500).json({ message: "Failed to update product", error: error.message, code: error.code, details: error.details });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    // Karena foreign key disetel ON DELETE CASCADE, menghapus produk otomatis membabat habis variannya
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
      .from('images')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });

    if (error) {
      const { data: dataAlt, error: errorAlt } = await supabase.storage
        .from('products')
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: true
        });

      if (errorAlt) throw errorAlt;

      const storagePath = buildStorageReference('products', filePath);
      const previewUrl = await createSignedAssetUrl(storagePath);

      return res.status(200).json({ url: storagePath, previewUrl, storagePath });
    }

    const storagePath = buildStorageReference('images', filePath);
    const previewUrl = await createSignedAssetUrl(storagePath);

    res.status(200).json({ url: storagePath, previewUrl, storagePath });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};
