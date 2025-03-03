const express = require('express');
const router = express.Router();
const pool = require('../database');
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, 'your_secret_key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

router.post('/add', authenticateToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [productId]);
    if (rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    const product = rows[0];

    const [cartRows] = await pool.query('SELECT * FROM cart WHERE userId = ? AND productId = ?', [req.user.userId, productId]);
    if (cartRows.length > 0) {
      await pool.query('UPDATE cart SET quantity = quantity + ? WHERE userId = ? AND productId = ?', [quantity, req.user.userId, productId]);
    } else {
      await pool.query('INSERT INTO cart (userId, productId, quantity) VALUES (?, ?, ?)', [req.user.userId, productId, quantity]);
    }

    res.json({ message: 'Item added to cart' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT cart.productId, cart.quantity, products.title, products.price, products.image
      FROM cart
      JOIN products ON cart.productId = products.id
      WHERE cart.userId = ?
    `, [req.user.userId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:productId', authenticateToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM cart WHERE userId = ? AND productId = ?', [req.user.userId, req.params.productId]);
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;