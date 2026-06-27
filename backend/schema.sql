-- Fermion Business Engine - Final Core Schema (PostgreSQL)
-- Formulation Date: June 17, 2026
-- Aesthetic: Professional Artisan Minimalist

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --- Utility Functions ---

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 0. Profiles Table (Users & Admins)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    full_name TEXT,
    phone TEXT,
    role TEXT DEFAULT 'RETAIL', -- 'RETAIL', 'B2B', 'ADMIN'
    
    -- Primary Address Fields
    address TEXT,
    city TEXT,
    postal_code TEXT,
    area_id TEXT, -- Biteship Area ID
    district TEXT,
    regency TEXT,
    province TEXT,
    patokan TEXT,
    
    -- Multi-address storage (JSON array)
    addresses_json JSONB DEFAULT '[]',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 1. Journal / Blog Posts Table
CREATE TABLE IF NOT EXISTS journal_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT DEFAULT 'Eksperimen', -- 'Eksperimen', 'Panen', 'Edukasi', 'Berita'
    content TEXT NOT NULL,
    excerpt TEXT, -- Brief abstract
    featured_image TEXT,
    status TEXT DEFAULT 'draft', -- 'draft', 'published'
    is_pinned BOOLEAN DEFAULT false,
    title_en TEXT,
    content_en TEXT,
    excerpt_en TEXT,
    author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

DROP TRIGGER IF EXISTS update_journal_posts_updated_at ON journal_posts;
CREATE TRIGGER update_journal_posts_updated_at BEFORE UPDATE ON journal_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 2. Products Table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    notes TEXT, -- Tasting notes summary
    origin TEXT,
    process TEXT,
    altitude TEXT,
    farm TEXT,
    description TEXT, -- Full narrative
    image_url TEXT,
    
    price_retail NUMERIC(12, 2) NOT NULL DEFAULT 0,
    discount_percent INTEGER DEFAULT 0,
    roast_profile TEXT DEFAULT 'Medium', -- 'Light', 'Medium', 'Dark', etc.
    
    -- Sensory Profile (0.0 - 5.0)
    sweetness NUMERIC(3, 1) DEFAULT 3.0,
    acidity NUMERIC(3, 1) DEFAULT 3.0,
    body NUMERIC(3, 1) DEFAULT 3.0,
    fermentation TEXT, -- Optional description
    
    stock_quantity INTEGER DEFAULT 0,
    category TEXT DEFAULT 'filter', -- 'espresso', 'filter'
    sub_category TEXT, -- 'specialty', 'exotic' (for filter), 'commodity', 'commercial' (for espresso)
    b2b_discount_enabled BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    linked_journal_id UUID REFERENCES journal_posts(id) ON DELETE SET NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE products ADD COLUMN IF NOT EXISTS b2b_discount_enabled BOOLEAN DEFAULT true;

-- 3. Pricing Tiers Table (B2B Fixed Prices per SKU)
CREATE TABLE IF NOT EXISTS pricing_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    tier_name TEXT NOT NULL, -- 'Bronze', 'Silver', 'Gold'
    unit_price NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, tier_name)
);

-- 4. B2B Partners Table (Detailed Business Profiles)
CREATE TABLE IF NOT EXISTS b2b_partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    address TEXT,
    google_place_id TEXT,
    estimated_volume_kg TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'suspended', 'flagged', 'onboarding'
    tier_name TEXT DEFAULT 'Bronze',
    is_silver_eligible BOOLEAN DEFAULT false,
    cafe_logo_url TEXT,
    current_evaluation_cycle INTEGER DEFAULT 1, 
    next_tier_progress INTEGER DEFAULT 0, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

DROP TRIGGER IF EXISTS update_b2b_partners_updated_at ON b2b_partners;
CREATE TRIGGER update_b2b_partners_updated_at BEFORE UPDATE ON b2b_partners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. Batches Table (Roastery Inventory Tracking)
CREATE TABLE IF NOT EXISTS batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    batch_number TEXT UNIQUE NOT NULL, -- e.g. BR-20260617-01
    roast_date DATE NOT NULL DEFAULT CURRENT_DATE,
    quantity_kg NUMERIC(10, 2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. B2B Contracts Table
CREATE TABLE IF NOT EXISTS b2b_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE NOT NULL,
    status TEXT DEFAULT 'active', -- 'active', 'expired', 'terminated'
    contract_sequence INTEGER DEFAULT 1,
    contract_type TEXT DEFAULT 'Bronze',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Evaluation Logs (Volume tracking for Tier adjustments)
CREATE TABLE IF NOT EXISTS evaluation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    month_year TEXT NOT NULL, -- e.g., '06-2026'
    total_volume_kg NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(profile_id, month_year)
);

-- 8. Orders Table (Retail & Wholesale)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    order_type TEXT DEFAULT 'retail', -- 'retail', 'wholesale', 'subscription', 'manual_offline'
    
    xendit_invoice_id TEXT,
    biteship_order_id TEXT,
    
    status TEXT DEFAULT 'UNPAID', -- UNPAID, PAID, ROASTING, READY_TO_SHIP, SHIPPED, DELIVERED, CANCELLED
    rejection_reason TEXT,
    
    total_amount NUMERIC(12, 2) NOT NULL,
    shipping_fee NUMERIC(12, 2) DEFAULT 0,
    shipping_courier TEXT,
    shipping_awb TEXT,
    shipping_label_url TEXT,
    
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_city TEXT NOT NULL,
    shipping_notes TEXT,
    type TEXT DEFAULT 'retail',
    
    -- QC Sensory Feedback (Saved during ROASTING phase)
    qc_sweetness NUMERIC(2,1),
    qc_acidity NUMERIC(2,1),
    qc_body NUMERIC(2,1),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    variant_weight TEXT NOT NULL, -- e.g. '250g', '1kg'
    variant_grind TEXT NOT NULL, -- e.g. 'Whole Bean', 'Fine'
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Cart Items Table (Persistent Cart)
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY, -- Using client-side UUID (lineItemId)
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    weight TEXT NOT NULL,
    grind TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    selected BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Tracking History Table (Biteship Webhook Cache)
CREATE TABLE IF NOT EXISTS tracking_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    description TEXT,
    location TEXT,
    raw_payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. FAQs Table
CREATE TABLE IF NOT EXISTS faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id TEXT NOT NULL,
    answer_id TEXT NOT NULL,
    question_en TEXT NOT NULL,
    answer_en TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Inquiries Table (Contact Form)
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new', -- 'new', 'read', 'replied'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. Subscription Plans Table
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    description TEXT,
    features JSONB DEFAULT '[]', -- Array of feature strings
    interval TEXT DEFAULT 'MONTH',
    interval_count INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

DROP TRIGGER IF EXISTS update_subscription_plans_updated_at ON subscription_plans;
CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON subscription_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 16. Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES subscription_plans(id) ON DELETE SET NULL,
    plan_name TEXT NOT NULL,
    status TEXT DEFAULT 'active', -- 'active', 'cancelled', 'paused'
    next_delivery_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
