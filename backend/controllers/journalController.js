import { supabase } from '../lib/supabase.js';
import { v4 as uuidv4 } from 'uuid';

export const getJournalPosts = async (req, res) => {
  try {
    const { status } = req.query;
    let query = supabase
      .from('journal_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch journal posts", error: error.message });
  }
};

export const createJournalPost = async (req, res) => {
  const { title, content, excerpt, featured_image, status, author_id } = req.body;
  const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  
  try {
    const { data, error } = await supabase
      .from('journal_posts')
      .insert([
        { 
          title, 
          slug, 
          content, 
          excerpt, 
          featured_image, 
          status: status || 'draft', 
          author_id, 
          published_at: status === 'published' ? new Date() : null 
        }
      ])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to create journal post", error: error.message });
  }
};

export const updateJournalPost = async (req, res) => {
  const { id } = req.params;
  const { title, content, excerpt, featured_image, status } = req.body;
  
  try {
    const publishedAt = status === 'published' ? new Date() : null;
    const updateData = {
      title,
      content,
      excerpt,
      featured_image,
      status,
      updated_at: new Date()
    };
    
    if (publishedAt) {
      updateData.published_at = publishedAt;
    }

    const { data, error } = await supabase
      .from('journal_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to update journal post", error: error.message });
  }
};

export const deleteJournalPost = async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from('journal_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete post", error: error.message });
  }
};
