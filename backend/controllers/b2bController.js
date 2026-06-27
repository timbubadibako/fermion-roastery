import { supabase } from '../lib/supabase.js';
import PDFDocument from 'pdfkit';
// TODO: [MAILER] Integrate Resend / Nodemailer to send Welcome B2B Email & Contract PDF

/**
 * Register a new B2B Partner and generate contract
 */
export const registerB2B = async (req, res) => {
  const { profileId, cafeName, cafeAddress, phone, volumeEstimate } = req.body;

  if (!profileId || !cafeName || !cafeAddress || !phone) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // 1. Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .eq('id', profileId)
      .single();

    if (profileError && profileError.code === 'PGRST116') return res.status(404).json({ message: "Profile not found" });
    if (profileError) throw profileError;

    // 2. Create or Update B2B Partner entry with 'onboarding' status
    const { data: existing, error: appError } = await supabase
      .from('b2b_partners')
      .select('id')
      .eq('profile_id', profileId)
      .maybeSingle();

    if (appError) throw appError;

    if (existing) {
      await supabase
        .from('b2b_partners')
        .update({
          company_name: cafeName,
          address: cafeAddress,
          estimated_volume_kg: volumeEstimate,
          status: 'onboarding',
          updated_at: new Date().toISOString()
        })
        .eq('profile_id', profileId);
    } else {
      await supabase
        .from('b2b_partners')
        .insert({
          profile_id: profileId,
          company_name: cafeName,
          address: cafeAddress,
          estimated_volume_kg: volumeEstimate,
          status: 'onboarding'
        });
    }

    // 3. Force role update (security measure)
    await supabase
      .from('profiles')
      .update({ role: 'B2B' })
      .eq('id', profileId);

    res.status(201).json({
      message: "Registration data saved. Please download and sign the contract.",
      status: 'onboarding'
    });
  } catch (error) {
    console.error('B2B Registration Error:', error);
    res.status(500).json({ message: "Failed to register B2B partner", error: error.message });
  }
};

export const getPartnerStatus = async (req, res) => {
  try {
    const profileId = req.user?.id;
    
    if (!profileId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // 🎯 KUNCI UTAMANYA: Ganti dari 'partners' menjadi 'b2b_partners' sesuai schema SQL asli lu!
    const { data: partnerData, error } = await supabase
      .from('b2b_partners') 
      .select('*')
      .eq('profile_id', profileId)
      .maybeSingle();

    if (error) throw error;

    if (partnerData) {
      return res.status(200).json([partnerData]);
    }

    res.status(200).json([]);
    
  } catch (error) {
    console.error("❌ Error di getPartnerStatus Controller:", error.message);
    res.status(500).json({ message: "Internal server error data fetching." });
  }
};

/**
 * Generate Dynamic B2B Contract PDF
 */
export const generateContract = async (req, res) => {
  const profileId = req.user?.id;

  try {
    const { data, error } = await supabase
      .from('b2b_partners')
      .select(`
        company_name,
        address,
        estimated_volume_kg,
        profiles!inner (
          full_name,
          email
        )
      `)
      .eq('profile_id', profileId)
      .single();

    if (error && error.code === 'PGRST116') return res.status(404).json({ message: "B2B Profile not found" });
    if (error) throw error;

    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    // Stream directly to response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Fermion_Contract_${data.company_name.replace(/ /g, '_')}.pdf`);
    doc.pipe(res);

    // --- PDF Header (Professional Artisan Aesthetic) ---
    doc.font('Courier-Bold').fontSize(24).text('FERMION.', { characterSpacing: 2 });
    doc.font('Courier').fontSize(8).text('B2B ECOSYSTEM // SYARAT KEMITRAAN V2.0', { characterSpacing: 1 });
    doc.moveDown(2);

    // --- Contract Info ---
    doc.font('Courier-Bold').fontSize(14).text('PERJANJIAN KERJASAMA: PEMASOK KOPI & LAYANAN');
    doc.moveDown();
    doc.font('Courier').fontSize(10);
    doc.text(`ID KONTRAK: #CTR-${profileId.slice(0, 8).toUpperCase()}`);
    doc.text(`TANGGAL: ${new Date().toLocaleDateString('id-ID')}`);
    doc.moveDown(2);

    // --- Parties ---
    doc.font('Courier-Bold').text('ANTARA:');
    doc.font('Courier').text('FERMION ROASTERY (Pihak Pertama)');
    doc.moveDown(0.5);
    doc.font('Courier-Bold').text('DAN:');
    doc.font('Courier').text(`${data.company_name} (Pihak Kedua)`);
    doc.text(`Perwakilan: ${data.profiles?.full_name}`);
    doc.text(`Alamat: ${data.address}`);
    doc.moveDown(2);

    // --- Terms ---
    doc.font('Courier-Bold').text('PASAL 1: KOMITMEN PENGADAAN');
    doc.font('Courier').text('1.1 Pihak Kedua berkomitmen untuk volume pembelian minimal 10kg per bulan.');
    doc.text('1.2 Perjanjian ini berlaku selama periode 6 bulan.');
    doc.text('1.3 Harga Tier Bronze (potongan Rp 10.000/kg) otomatis aktif setelah kontrak disetujui.');
    doc.moveDown();

    doc.font('Courier-Bold').text('PASAL 2: LAYANAN & PEMELIHARAAN');
    doc.font('Courier').text('2.1 Servis mesin espresso & grinder gratis disediakan 2x per periode kontrak.');
    doc.text('2.2 Manfaat servis aktif mulai dari urutan kontrak kedua.');
    doc.moveDown(3);

    // --- Signature Area ---
    doc.font('Courier-Bold').text('TANDA TANGAN:', { underline: true });
    doc.moveDown(4);

    const startX = doc.x;
    const currentY = doc.y;

    doc.text('__________________________', startX, currentY);
    doc.text('(FERMION ROASTERY)', startX, currentY + 15);

    doc.text('__________________________', startX + 250, currentY);
    doc.text(`(${data.company_name.toUpperCase()})`, startX + 250, currentY + 15);

    doc.end();
  } catch (error) {
    console.error('Contract Generation Error:', error);
    res.status(500).send("Failed to generate contract PDF");
  }
};

/**
 * Handle Contract Upload
 */
export const uploadContract = async (req, res) => {
  const { fileData, mimetype } = req.body;
  const profileId = req.user?.id;

  if (!fileData || !profileId) {
    return res.status(400).json({ message: "Missing file data or profile ID" });
  }

  // Decode base64
  const base64Content = fileData.split(',')[1];
  const fileBuffer = Buffer.from(base64Content, 'base64');

  try {
    // Fetch company name for descriptive filename
    const { data: partnerData, error: partnerError } = await supabase
      .from('b2b_partners')
      .select('company_name')
      .eq('profile_id', profileId)
      .maybeSingle();

    const rawCompanyName = partnerData?.company_name || 'Unknown_Partner';
    const companyName = rawCompanyName.replace(/[^a-zA-Z0-9]/g, '_');
    const dateStr = new Date().toISOString().split('T')[0];
    const filePath = `Contract_${companyName}_${dateStr}_${profileId.slice(0, 5)}.pdf`;

    // 1. Upload to Supabase Storage (b2b_contracts bucket)
    const { data: storageData, error: storageError } = await supabase.storage
      .from('b2b_contracts')
      .upload(filePath, fileBuffer, {
        contentType: mimetype,
        upsert: true
      });

    if (storageError) throw new Error(`Storage upload failed: ${storageError.message}`);

    // Get the public URL (if the bucket is public) or we just store the path
    const { data: urlData } = supabase.storage.from('b2b_contracts').getPublicUrl(filePath);

    // 2. Update Database Status and save the URL
    const { error: dbError } = await supabase
      .from('b2b_partners')
      .update({
        status: 'awaiting_contract_review',
        // Assuming we add a column or just keep track of it, but for now we definitely change the status
        // contract_url: urlData.publicUrl 
      })
      .eq('profile_id', profileId);

    if (dbError) throw dbError;

    res.status(200).json({
      message: "Contract uploaded securely to cloud. Awaiting admin review.",
      status: 'awaiting_contract_review',
      url: urlData.publicUrl
    });
  } catch (error) {
    console.error("Upload Contract Error:", error);
    res.status(500).json({ message: "Failed to upload contract", error: error.message });
  }
};

/**
 * Generate Dummy Test Contract PDF
 */
export const testContract = async (req, res) => {
  try {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    // Stream directly to response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Dummy_Contract_Test.pdf"`);
    doc.pipe(res);

    // --- PDF Header (Professional Artisan Aesthetic) ---
    doc.font('Courier-Bold').fontSize(24).text('FERMION.', { characterSpacing: 2 });
    doc.font('Courier').fontSize(8).text('B2B ECOSYSTEM // SYARAT KEMITRAAN V2.0', { characterSpacing: 1 });
    doc.moveDown(2);

    // --- Contract Info ---
    doc.font('Courier-Bold').fontSize(14).text('PERJANJIAN KERJASAMA: PEMASOK KOPI & LAYANAN');
    doc.moveDown();
    doc.font('Courier').fontSize(10);
    doc.text(`ID KONTRAK: #CTR-DUMMY123`);
    doc.text(`TANGGAL: ${new Date().toLocaleDateString('id-ID')}`);
    doc.moveDown(2);

    // --- Parties ---
    doc.font('Courier-Bold').text('ANTARA:');
    doc.font('Courier').text('FERMION ROASTERY (Pihak Pertama)');
    doc.moveDown(0.5);
    doc.font('Courier-Bold').text('DAN:');
    doc.font('Courier').text(`PT. CONTOH KAFE SEJAHTERA (Pihak Kedua)`);
    doc.text(`Perwakilan: Jhon Doe`);
    doc.text(`Alamat: Jl. Kopi Santai No. 99, Jakarta`);
    doc.moveDown(2);

    // --- Terms ---
    doc.font('Courier-Bold').text('PASAL 1: KOMITMEN PENGADAAN');
    doc.font('Courier').text('1.1 Pihak Kedua berkomitmen untuk volume pembelian minimal 20-50KG per bulan.');
    doc.text('1.2 Perjanjian ini berlaku selama periode 6 bulan.');
    doc.text('1.3 Harga Grosir (Grup B2B) otomatis aktif di website setelah kontrak disetujui.');
    doc.moveDown();

    doc.font('Courier-Bold').text('PASAL 2: LAYANAN & PEMELIHARAAN');
    doc.font('Courier').text('2.1 Servis mesin espresso & grinder gratis disediakan 2x per periode kontrak.');
    doc.text('2.2 Manfaat servis aktif mulai dari transaksi B2B kedua.');
    doc.moveDown(3);

    // --- Signature Area ---
    doc.font('Courier-Bold').text('TANDA TANGAN:', { underline: true });
    doc.moveDown(4);

    const startX = doc.x;
    const currentY = doc.y;

    doc.text('__________________________', startX, currentY);
    doc.text('(FERMION ROASTERY)', startX, currentY + 15);

    doc.text('__________________________', startX + 250, currentY);
    doc.text(`(PT. CONTOH KAFE SEJAHTERA)`, startX + 250, currentY + 15);

    doc.end();
  } catch (error) {
    console.error('Dummy Contract Generation Error:', error);
    res.status(500).send("Failed to generate dummy contract PDF");
  }
};
