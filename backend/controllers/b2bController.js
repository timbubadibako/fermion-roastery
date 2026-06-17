import { query } from '../lib/db.js';
import PDFDocument from 'pdfkit';

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
    const profileRes = await query('SELECT id, email, full_name FROM profiles WHERE id = $1', [profileId]);
    if (profileRes.rows.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }
    const profile = profileRes.rows[0];

    // 2. Create or Update B2B Partner entry with 'onboarding' status
    const existing = await query('SELECT id FROM b2b_partners WHERE profile_id = $1', [profileId]);
    
    if (existing.rows.length > 0) {
      await query(
        `UPDATE b2b_partners 
         SET company_name = $1, address = $2, estimated_volume_kg = $3, status = 'onboarding'
         WHERE profile_id = $4`,
        [cafeName, cafeAddress, volumeEstimate, profileId]
      );
    } else {
      await query(
        `INSERT INTO b2b_partners (profile_id, company_name, address, estimated_volume_kg, status)
         VALUES ($1, $2, $3, $4, 'onboarding')`,
        [profileId, cafeName, cafeAddress, volumeEstimate]
      );
    }

    // 3. Force role update (security measure)
    await query("UPDATE profiles SET role = 'B2B' WHERE id = $1", [profileId]);

    res.status(201).json({ 
      message: "Registration data saved. Please download and sign the contract.",
      status: 'onboarding'
    });
  } catch (error) {
    console.error('B2B Registration Error:', error);
    res.status(500).json({ message: "Failed to register B2B partner", error: error.message });
  }
};

/**
 * Generate Dynamic B2B Contract PDF
 */
export const generateContract = async (req, res) => {
  const { profileId } = req.query;

  try {
    const result = await query(
      `SELECT p.full_name, p.email, b.company_name, b.address, b.estimated_volume_kg 
       FROM profiles p 
       JOIN b2b_partners b ON p.id = b.profile_id 
       WHERE p.id = $1`, 
      [profileId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "B2B Profile not found" });
    }

    const data = result.rows[0];
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
    doc.text(`Perwakilan: ${data.full_name}`);
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
  const { profileId } = req.body;
  // File would be handled by middleware like multer, here we assume it's processed
  // For prototype, we just update the status
  
  try {
    await query(
      "UPDATE b2b_partners SET status = 'awaiting_contract_review' WHERE profile_id = $1",
      [profileId]
    );
    res.status(200).json({ message: "Contract uploaded successfully. Awaiting admin review.", status: 'awaiting_contract_review' });
  } catch (error) {
    res.status(500).json({ message: "Failed to upload contract", error: error.message });
  }
};
