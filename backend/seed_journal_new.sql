ALTER TABLE journal_posts ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;

DELETE FROM journal_posts;

INSERT INTO journal_posts (title, slug, excerpt, content, status, is_pinned, featured_image, category, published_at)
VALUES 
(
    'The Art of Anaerobic Fermentation', 
    'art-of-anaerobic', 
    'Exploring how oxygen deprivation in the processing stage unlocks wild, experimental fruit notes.', 
    '<p>Anaerobic fermentation is pushing the boundaries of coffee processing...</p>', 
    'published', 
    true,
    'https://placehold.co/800x800/7C2D12/F1B941?text=Anaerobic',
    'Eksperimen',
    NOW() - INTERVAL '1 day'
),
(
    'Dialing in the Perfect Espresso', 
    'dialing-in-espresso', 
    'A technical deep dive into water chemistry, pump pressure, and extraction yields for light-roasted single origins.', 
    '<p>Espresso extraction is a delicate balance of variables...</p>', 
    'published', 
    true,
    'https://placehold.co/800x800/2A1619/F1B941?text=Espresso',
    'Edukasi',
    NOW() - INTERVAL '2 days'
),
(
    'Sourcing Trip: The Gayo Highlands', 
    'sourcing-gayo-highlands', 
    'Our journey to Sumatra. Discovering the altitude, the soil, and the passionate farmers behind our most robust blend.', 
    '<p>The Gayo Highlands offer some of the most unique terroir in Indonesia...</p>', 
    'published', 
    true,
    'https://placehold.co/800x800/367F4D/FFFFFF?text=Sourcing+Trip',
    'Panen',
    NOW() - INTERVAL '3 days'
),
(
    'The Future of Specialty Coffee', 
    'future-specialty-coffee', 
    'How climate change and new processing methods are reshaping the flavor profiles of tomorrow.', 
    '<p>The future of specialty coffee relies heavily on sustainability...</p>', 
    'published', 
    true,
    'https://placehold.co/800x800/1A2B20/EBA294?text=Future+Coffee',
    'Berita',
    NOW() - INTERVAL '4 days'
),
(
    'Understanding Coffee Varietals', 
    'understanding-varietals', 
    'From Bourbon to Gesha: Why genetics matter in your morning cup.', 
    '<p>Just like wine, coffee has different varietals that impact flavor...</p>', 
    'published', 
    false,
    'https://placehold.co/800x800/E2DACB/2A1619?text=Varietals',
    'Edukasi',
    NOW() - INTERVAL '5 days'
),
(
    'Brewing with the V60: A Masterclass', 
    'v60-masterclass', 
    'Step-by-step guide to achieving the clearest, most vibrant cup using a Hario V60.', 
    '<p>The V60 is an iconic pour-over brewer that demands precision...</p>', 
    'published', 
    false,
    'https://placehold.co/800x800/F1B941/2A1619?text=V60+Brewing',
    'Edukasi',
    NOW() - INTERVAL '6 days'
),
(
    'Harvest Season 2026: What to Expect', 
    'harvest-season-2026', 
    'An inside look at the upcoming harvest and the promising micro-lots we’ve secured.', 
    '<p>This year’s harvest has been shaped by unique weather patterns...</p>', 
    'published', 
    false,
    'https://placehold.co/800x800/EBA294/1A2B20?text=Harvest+2026',
    'Panen',
    NOW() - INTERVAL '7 days'
),
(
    'Why We Roast Light', 
    'why-we-roast-light', 
    'The philosophy behind our roasting style and how it preserves the bean’s origin characteristics.', 
    '<p>Light roasting is about highlighting the terroir, not masking it...</p>', 
    'published', 
    false,
    'https://placehold.co/800x800/FAF9F6/7C2D12?text=Light+Roast',
    'Eksperimen',
    NOW() - INTERVAL '8 days'
);
