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
    tier_name TEXT DEFAULT NULL, -- 'Bronze', 'Silver', 'Gold'
    current_evaluation_cycle INTEGER DEFAULT 1, -- Current month in the 3-month window
    next_tier_progress INTEGER DEFAULT 0, -- Calculated percentage towards the next tier (0-100)
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

-- 5. Contracts Table (Price Locking)
CREATE TABLE IF NOT EXISTS contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    fixed_price NUMERIC(12, 2) NOT NULL,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(profile_id, product_id)
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
