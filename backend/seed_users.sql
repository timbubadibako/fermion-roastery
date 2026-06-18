-- Seed Users for Fermion Roastery
-- Assuming Supabase/PostgreSQL environment

INSERT INTO profiles (email, password_hash, full_name, role)
VALUES 
('admin@fermion.co', 'dummy_hash', 'Admin Fermion', 'ADMIN'),
('partner@cafe.com', 'dummy_hash', 'B2B Partner', 'B2B'),
('customer@user.com', 'dummy_hash', 'Regular Customer', 'RETAIL')
ON CONFLICT (email) DO NOTHING;

-- Optionally insert B2B partner info for the B2B user
INSERT INTO b2b_partners (profile_id, company_name, status)
SELECT id, 'Partner Cafe', 'approved'
FROM profiles
WHERE email = 'partner@cafe.com'
ON CONFLICT (profile_id) DO NOTHING;
