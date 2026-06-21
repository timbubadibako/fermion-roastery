-- seed_faqs.sql
-- Seed data for FAQs to populate the FAQSection.

INSERT INTO faqs (question_en, answer_en, question_id, answer_id)
VALUES 
(
    'What is Fermion Roastery?', 
    'Fermion Roastery is a precision-focused micro roastery. We blend artisan roasting methods to bring out the absolute best in every bean we source.', 
    'Apa itu Fermion Roastery?', 
    'Fermion Roastery adalah micro roastery yang berfokus pada kualitas. Kami memadukan presisi dengan penyangraian artisan untuk mengeluarkan potensi terbaik dari setiap biji kopi.'
),
(
    'How do I become a B2B partner?', 
    'We offer specialized wholesale programs for cafes and restaurants. Please visit our Wholesale page to submit an inquiry, and our lab team will contact you for a tasting session.', 
    'Bagaimana cara menjadi mitra B2B?', 
    'Kami menawarkan program grosir khusus untuk kafe dan restoran. Silakan kunjungi halaman Wholesale (Grosir) kami untuk mengajukan permintaan, dan tim lab kami akan menghubungi Anda untuk sesi pencicipan (tasting).'
),
(
    'What is the minimum purchase for wholesale?', 
    'Our wholesale pricing tiers begin at a minimum order of 5kg per month. We offer scalable pricing as your volume increases.', 
    'Berapa minimal pembelian untuk grosir?', 
    'Tingkat harga grosir kami dimulai dengan pesanan minimum 5kg per bulan. Kami menawarkan harga yang dapat disesuaikan seiring dengan peningkatan volume Anda.'
),
(
    'Do you ship internationally?', 
    'Currently, we focus on delivering the freshest roasts within Indonesia to maintain quality. However, we are actively exploring international shipping options.', 
    'Apakah Anda melayani pengiriman internasional?', 
    'Saat ini, kami fokus mengirimkan hasil sangrai paling segar di seluruh Indonesia untuk menjaga kualitas. Namun, kami sedang aktif menjajaki opsi pengiriman internasional.'
),
(
    'How often do you release new beans?', 
    'We drop new "Produk" (single origins and experimental lots) bi-weekly. Keep an eye on the "New Releases" section or subscribe to our newsletter for early access.', 
    'Seberapa sering Anda merilis biji kopi baru?', 
    'Kami merilis "Kopi" baru (single origin dan lot eksperimental) setiap dua minggu. Pantau terus bagian "New Releases" atau berlangganan newsletter kami untuk akses awal.'
)
ON CONFLICT DO NOTHING;
