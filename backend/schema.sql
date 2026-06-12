-- Fermion Business Engine - Core Schema (PostgreSQL)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 0. Profiles Table (Users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT, -- For local auth during prototype
    full_name TEXT,
    role TEXT DEFAULT 'RETAIL', -- 'RETAIL', 'B2B', 'ADMIN'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 1. Products Table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    notes TEXT, -- Tasting notes
    origin TEXT,
    process TEXT,
    altitude TEXT,
    price_retail NUMERIC(12, 2) NOT NULL DEFAULT 0,
    discount_percent INTEGER DEFAULT 0, -- Admin controlled discount
    roast_profile TEXT, -- e.g., 'Filter', 'Espresso'
    description TEXT,
    farm TEXT,
    image_url TEXT,
    
    -- Sensory Profile (1-5)
    fermentation INTEGER DEFAULT 3,
    sweetness INTEGER DEFAULT 3,
    acidity INTEGER DEFAULT 3,
    body INTEGER DEFAULT 3,
    
    stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Pricing Tiers Table (B2B Fixed Prices)
CREATE TABLE IF NOT EXISTS pricing_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    tier_name TEXT NOT NULL, -- 'Bronze', 'Silver', 'Gold'
    unit_price NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, tier_name)
);

-- 3. B2B Partners Table
CREATE TABLE IF NOT EXISTS b2b_partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    address TEXT,
    google_place_id TEXT,
    estimated_volume_kg TEXT, -- e.g. '5-10KG'
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    tier_name TEXT DEFAULT 'Bronze', -- 'Bronze', 'Silver', 'Gold'
    is_silver_eligible BOOLEAN DEFAULT false,
    cafe_logo_url TEXT,
    current_evaluation_cycle INTEGER DEFAULT 1, 
    next_tier_progress INTEGER DEFAULT 0, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Batches Table (Inventory)
CREATE TABLE IF NOT EXISTS batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    batch_number TEXT UNIQUE NOT NULL,
    roast_date DATE NOT NULL,
    quantity_kg NUMERIC(10, 2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. B2B Contracts Table
CREATE TABLE IF NOT EXISTS b2b_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE NOT NULL,
    status TEXT DEFAULT 'active', -- 'active', 'expired', 'terminated'
    contract_sequence INTEGER DEFAULT 1,
    contract_type TEXT DEFAULT 'Bronze', -- 'Bronze', 'Silver', 'Gold'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Evaluation Logs Table (Volume Tracking)
CREATE TABLE IF NOT EXISTS evaluation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    month_year TEXT NOT NULL, -- e.g., '06-2026'
    total_volume_kg NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(profile_id, month_year)
);


-- 7. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- Nullable for guest checkout
    xendit_invoice_id TEXT,
    biteship_order_id TEXT,
    status TEXT DEFAULT 'UNPAID', -- UNPAID, PAID, ROASTING, SHIPPED, DELIVERED, CANCELLED
    total_amount NUMERIC(12, 2) NOT NULL,
    shipping_fee NUMERIC(12, 2) DEFAULT 0,
    shipping_courier TEXT,
    shipping_awb TEXT, -- Resi number
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_city TEXT NOT NULL,
    shipping_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    variant_weight TEXT NOT NULL,
    variant_grind TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()

RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_b2b_partners_updated_at
    BEFORE UPDATE ON b2b_partners
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 9. FAQs Table
CREATE TABLE IF NOT EXISTS faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id TEXT NOT NULL,
    answer_id TEXT NOT NULL,
    question_en TEXT NOT NULL,
    answer_en TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Inquiries Table (Contact Form)
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new', -- 'new', 'read', 'replied'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
