import { query } from '../lib/db.js';
import { v4 as uuidv4 } from 'uuid';

export const getJournalPosts = async (req, res) => {
  try {
    const { status } = req.query;
    let sql = 'SELECT * FROM journal_posts';
    let params = [];
    if (status) {
      sql += ' WHERE status = $1';
      params.push(status);
    }
    sql += ' ORDER BY created_at DESC';
    const result = await query(sql, params);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch journal posts", error: error.message });
  }
};

export const createJournalPost = async (req, res) => {
  const { title, content, excerpt, featured_image, status, author_id } = req.body;
  const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  
  try {
    const result = await query(
      `INSERT INTO journal_posts (title, slug, content, excerpt, featured_image, status, author_id, published_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [title, slug, content, excerpt, featured_image, status || 'draft', author_id, status === 'published' ? new Date() : null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Failed to create journal post", error: error.message });
  }
};

export const updateJournalPost = async (req, res) => {
  const { id } = req.params;
  const { title, content, excerpt, featured_image, status } = req.body;
  
  try {
    const publishedAt = status === 'published' ? new Date() : null;
    const result = await query(
      `UPDATE journal_posts 
       SET title = $1, content = $2, excerpt = $3, featured_image = $4, status = $5, published_at = COALESCE($6, published_at), updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 RETURNING *`,
      [title, content, excerpt, featured_image, status, publishedAt, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Failed to update journal post", error: error.message });
  }
};

export const deleteJournalPost = async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM journal_posts WHERE id = $1', [id]);
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete post", error: error.message });
  }
};
