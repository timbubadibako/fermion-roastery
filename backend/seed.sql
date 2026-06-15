-- Seed Data for Fermion Roastery

-- 1. Insert Products
INSERT INTO products (name, slug, notes, origin, process, altitude, price_retail, discount_percent, roast_profile, description, farm, image_url, fermentation, sweetness, acidity, body, stock_quantity)
VALUES 
('NOT ONLY INTENSE', 'not-only-intense', 'black cherry, red apple, tamarind, brown sugar, toffee', 'Kendal x Sumedang', 'NATURAL YEAST', '700 MDPL', 145000, 0, 'Espresso Roast', 'A bold exploration of flavor...', 'Various smallholder farmers', 'https://placehold.co/800x1000/7a9cff/ffffff?text=NOT+ONLY+INTENSE', 4, 5, 3, 4, 50),
('SUMEDANG ANAEROB', 'sumedang-anaerob', 'pineapple, passion fruit, cacao nibs, caramel', 'Sumedang, West Java', 'ANAEROB NATURAL', '1200 MDPL', 165000, 10, 'Filter Roast', 'Experience the vibrant profile...', 'Mt. Tampomas', 'https://placehold.co/800x1000/ffd700/0f172a?text=SUMEDANG+ANAEROB', 5, 4, 4, 3, 30),
('GAYO WASHED', 'gayo-washed', 'citrus, jasmine, black tea, honey', 'Aceh Gayo', 'FULLY WASHED', '1500 MDPL', 115000, 0, 'Filter Roast', 'A clean and bright cup...', 'Gayo Organic Cooperative', 'https://placehold.co/800x1000/ff4b4b/ffffff?text=GAYO+WASHED', 1, 4, 5, 2, 100);

-- 2. Insert Pricing Tiers for 'NOT ONLY INTENSE'
-- Assume product ID will be fetched or we use the slug to find it
-- For seeding, we can use a subquery
INSERT INTO pricing_tiers (product_id, tier_name, unit_price)
SELECT id, 'Bronze', 130000 FROM products WHERE slug = 'not-only-intense';
INSERT INTO pricing_tiers (product_id, tier_name, unit_price)
SELECT id, 'Silver', 120000 FROM products WHERE slug = 'not-only-intense';
INSERT INTO pricing_tiers (product_id, tier_name, unit_price)
SELECT id, 'Gold', 110000 FROM products WHERE slug = 'not-only-intense';

-- 3. Insert Pricing Tiers for 'SUMEDANG ANAEROB'
INSERT INTO pricing_tiers (product_id, tier_name, unit_price)
SELECT id, 'Bronze', 150000 FROM products WHERE slug = 'sumedang-anaerob';
INSERT INTO pricing_tiers (product_id, tier_name, unit_price)
SELECT id, 'Silver', 140000 FROM products WHERE slug = 'sumedang-anaerob';
INSERT INTO pricing_tiers (product_id, tier_name, unit_price)
SELECT id, 'Gold', 130000 FROM products WHERE slug = 'sumedang-anaerob';

-- 4. Insert FAQ Data
INSERT INTO faqs (question_id, answer_id, question_en, answer_en, sort_order)
VALUES 
('Apa itu Fermion Roastery?', 'Fermion Roastery adalah laboratorium sangrai kopi yang berfokus pada pendekatan ilmiah untuk menghasilkan profil rasa yang unik.', 'What is Fermion Roastery?', 'Fermion Roastery is a coffee roasting laboratory focused on a scientific approach to produce unique flavor profiles.', 1),
('Bagaimana cara menjadi mitra B2B?', 'Anda bisa mendaftar melalui halaman Wholesale dan mengisi formulir aplikasi yang tersedia.', 'How do I become a B2B partner?', 'You can register via the Wholesale page and fill out the available application form.', 2),
('Berapa minimal pembelian untuk grosir?', 'Minimal pembelian untuk kontrak B2B adalah 10kg per bulan selama periode 6 bulan.', 'What is the minimum purchase for wholesale?', 'The minimum purchase for a B2B contract is 10kg per month over a 6-month period.', 3);
