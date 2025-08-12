const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../cloudinary');

const upload = multer();

router.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const streamUpload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'image' },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const result = await streamUpload();
    res.json({ url: result.secure_url });
  } catch (err) {
    console.error('Image upload error:', err);
    res.status(500).json({ error: 'Image upload failed' });
  }
});

router.post('/', async (req, res) => {
  const { title, description, contact, phone, image, tag, username } = req.body;

  if (!title || !description || !contact || !phone || !image || !tag || !username) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO items (title, description, contact, phone, image, tag, username)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, description, contact, phone, image, tag, username]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding item:', err.message);
    res.status(500).json({ error: 'Failed to add item' });
  }
});

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, contact, phone, image, tag, username } = req.body;

  if (!title || !description || !contact || !phone || !image || !tag || !username) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const check = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
    if (!check.rows.length) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const item = check.rows[0];
    if (item.username !== username) {
      return res.status(403).json({ error: 'You can only edit your own items' });
    }

    const result = await pool.query(
      `UPDATE items 
       SET title = $1, description = $2, contact = $3, phone = $4, image = $5, tag = $6 
       WHERE id = $7 
       RETURNING *`,
      [title, description, contact, phone, image, tag, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating item:', err.message);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const username = req.headers['x-username'];

  if (isNaN(id) || !username) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  try {
    const check = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
    if (!check.rows.length) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const item = check.rows[0];
    if (item.username !== username) {
      return res.status(403).json({ error: 'You can only delete your own items' });
    }

    await pool.query('DELETE FROM items WHERE id = $1', [id]);
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error('Error deleting item:', err.message);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

module.exports = router;