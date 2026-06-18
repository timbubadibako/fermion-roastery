-- Seed Data for Subscription Plans
-- Using single-line inserts to ensure no invalid characters (like 0x0a) exist within the JSON string.

INSERT INTO subscription_plans (name, price, description, features, interval, interval_count) VALUES ('The Discovery', 135000, 'A surprise rotating single-origin bag delivered to your door.', '["Rotating Origins", "Roast Date Guarantee", "Brewing Guide Included"]', 'MONTH', 1);
INSERT INTO subscription_plans (name, price, description, features, interval, interval_count) VALUES ('Master''s Choice', 285000, 'The Head Roaster''s personal selection. Two bags of the absolute best beans in our lab right now.', '["Double Pack (500g Total)", "Unreleased Micro-lots", "Direct Notes from Roaster", "Free Shipping Included"]', 'MONTH', 1);
INSERT INTO subscription_plans (name, price, description, features, interval, interval_count) VALUES ('The Collector', 450000, 'Extremely limited competition-grade beans and experimental yeast processes.', '["Competition Grade Beans", "Early Access to New Batches", "Premium Packaging"]', 'MONTH', 1);
