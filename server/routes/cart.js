require('dotenv').config();
const express = require('express');
const router = express.Router();
const pool = require('../database');
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    console.log('Authentication failed: No token provided');
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      console.error('Authentication failed: Invalid token', err);
      return res.sendStatus(403);
    }
    console.log('Authentication successful:', user);
    req.user = user;
    next();
  });
}

router.post('/add', authenticateToken, async (req, res) => {
  try {
    console.log('Add to cart request received:', req.body);
    const { productId, quantity } = req.body;
    const userId = req.user.userId;

    console.log('User ID:', userId);
    console.log('Product ID:', productId);
    console.log('Quantity:', quantity);

    // Check if the product is already in the cart
    console.log('Checking if product exists in cart...');
    const [existingItem] = await pool.query('SELECT * FROM cart WHERE userId = ? AND productId = ?', [userId, productId]);
    console.log('Existing item:', existingItem);

    if (existingItem.length > 0) {
      // Update the quantity if the product is already in the cart
      console.log('Product already in cart, updating quantity...');
      await pool.query('UPDATE cart SET quantity = quantity + ? WHERE userId = ? AND productId = ?', [quantity, userId, productId]);
      console.log('Quantity updated.');
    } else {
      // Add the product to the cart
      console.log('Product not in cart, adding new item...');
      await pool.query('INSERT INTO cart (userId, productId, quantity) VALUES (?, ?, ?)', [userId, productId, quantity]);
      console.log('Product added to cart.');
    }

    res.status(201).send('Product added to cart');
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log('Get cart items request received');
    const userId = req.user.userId;

    console.log('User ID:', userId);

    console.log('Fetching cart items from database...');
    const [cartItems] = await pool.query('SELECT cart.productId, cart.quantity, products.title, products.price, products.image FROM cart JOIN products ON cart.productId = products.id WHERE cart.userId = ?', [userId]);
    console.log('Cart items:', cartItems);

    res.json(cartItems);
  } catch (error) {
    console.error('Error getting cart items:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.delete('/:productId', authenticateToken, async (req, res) => {
  try {
    console.log('Delete cart item request received:', req.params.productId);
    const userId = req.user.userId;
    const productId = req.params.productId;

    console.log('User ID:', userId);
    console.log('Product ID:', productId);

    console.log('Deleting product from cart...');
    await pool.query('DELETE FROM cart WHERE userId = ? AND productId = ?', [userId, productId]);
    console.log('Product deleted from cart.');

    res.send('Product removed from cart');
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;