-- seed_journal.sql
-- Seed data for Journal Posts to ensure the JournalSectionV2 renders correctly.

-- Ensure the table exists (assuming standard schema for journal posts)
-- Assuming table name is 'journal_posts' or 'posts', adjusting to match typical naming.
-- We will use 'journal_posts' based on typical conventions, adjust if schema differs.

INSERT INTO journal_posts (title, slug, excerpt, content, status, published_at)
VALUES 
(
    'The Art of Anaerobic Fermentation', 
    'art-of-anaerobic', 
    'Exploring how oxygen deprivation in the processing stage unlocks wild, experimental fruit notes in our latest Sumedang lot.', 
    '<p>Anaerobic fermentation is pushing the boundaries of coffee processing...</p>', 
    'published', 
    NOW()
),
(
    'Dialing in the Perfect Espresso', 
    'dialing-in-espresso', 
    'A technical deep dive into water chemistry, pump pressure, and extraction yields for light-roasted single origins.', 
    '<p>Espresso extraction is a delicate balance of variables...</p>', 
    'published', 
    NOW()
),
(
    'Sourcing Trip: The Gayo Highlands', 
    'sourcing-gayo-highlands', 
    'Our journey to Sumatra. Discovering the altitude, the soil, and the passionate farmers behind our most robust blend.', 
    '<p>The Gayo Highlands offer some of the most unique terroir in Indonesia...</p>', 
    'published', 
    NOW()
)
ON CONFLICT (slug) DO NOTHING;
