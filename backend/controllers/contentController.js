import { supabase } from '../lib/supabase.js';

export const getFaqs = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    res.status(200).json(data);
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
    const { data, error } = await supabase
      .from('inquiries')
      .insert([{ full_name, email, message }])
      .select()
      .single();
    
    if (error) throw error;
    res.status(201).json({ message: "Inquiry submitted successfully", inquiry: data });
  } catch (error) {
    console.error('Create Inquiry Error:', error);
    res.status(500).json({ message: "Failed to submit inquiry", error: error.message });
  }
};

export const createFaq = async (req, res) => {
  const { question_id, answer_id, question_en, answer_en, sort_order = 0 } = req.body;
  try {
    const { data, error } = await supabase
      .from('faqs')
      .insert([{ question_id, answer_id, question_en, answer_en, sort_order }])
      .select()
      .single();
    
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error creating FAQ", error: error.message });
  }
};

export const updateFaq = async (req, res) => {
  const { id } = req.params;
  const { question_id, answer_id, question_en, answer_en, sort_order } = req.body;
  try {
    const { data, error } = await supabase
      .from('faqs')
      .update({ question_id, answer_id, question_en, answer_en, sort_order })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error updating FAQ", error: error.message });
  }
};

export const deleteFaq = async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from('faqs')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    res.status(200).json({ message: "FAQ deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting FAQ", error: error.message });
  }
};

export const getInquiries = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error('Get Inquiries Error:', error);
    res.status(500).json({ message: "Failed to fetch inquiries", error: error.message });
  }
};
