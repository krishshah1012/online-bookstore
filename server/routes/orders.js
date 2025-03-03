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

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { items, total } = req.body;
    await pool.query('INSERT INTO orders (userId, items, total) VALUES (?, ?, ?)', [req.user.userId, JSON.stringify(items), total]);
    await pool.query('DELETE FROM cart WHERE userId = ?', [req.user.userId]);
    res.json({ message: 'Order placed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM orders WHERE userId = ?', [req.user.userId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;