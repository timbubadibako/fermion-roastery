import { query } from '../lib/db.js';

export const getFaqs = async (req, res) => {
  try {
    const result = await query('SELECT * FROM faqs ORDER BY sort_order ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Get FAQs Error:', error);
    res.status(500).json({ message: "Failed to fetch FAQs", error: error.message });
  }
};

export const createInquiry = async (req, res) => {
  const { full_name, email, message } = req.body;

  if (!full_name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await query(
      'INSERT INTO inquiries (full_name, email, message) VALUES ($1, $2, $3) RETURNING *',
      [full_name, email, message]
    );
    res.status(201).json({ message: "Inquiry submitted successfully", inquiry: result.rows[0] });
  } catch (error) {
    console.error('Create Inquiry Error:', error);
    res.status(500).json({ message: "Failed to submit inquiry", error: error.message });
  }
};

export const getInquiries = async (req, res) => {
  try {
    const result = await query('SELECT * FROM inquiries ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Get Inquiries Error:', error);
    res.status(500).json({ message: "Failed to fetch inquiries", error: error.message });
  }
};
