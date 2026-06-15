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

export const createFaq = async (req, res) => {
  const { question_id, answer_id, question_en, answer_en, sort_order = 0 } = req.body;
  try {
    const result = await query(
      'INSERT INTO faqs (question_id, answer_id, question_en, answer_en, sort_order) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [question_id, answer_id, question_en, answer_en, sort_order]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error creating FAQ", error: error.message });
  }
};

export const updateFaq = async (req, res) => {
  const { id } = req.params;
  const { question_id, answer_id, question_en, answer_en, sort_order } = req.body;
  try {
    const result = await query(
      'UPDATE faqs SET question_id = $1, answer_id = $2, question_en = $3, answer_en = $4, sort_order = $5 WHERE id = $6 RETURNING *',
      [question_id, answer_id, question_en, answer_en, sort_order, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error updating FAQ", error: error.message });
  }
};

export const deleteFaq = async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM faqs WHERE id = $1', [id]);
    res.status(200).json({ message: "FAQ deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting FAQ", error: error.message });
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
