require('dotenv').config();

const express = require('express');
const router = express.Router();
const userModel = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  try {
    const userId = await userModel.createUser(req.body);
    res.status(201).json({ id: userId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await userModel.getUserByUsername(req.body.username);
    if (!user) return res.status(400).json({ message: 'Cannot find user' });
    if (await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);
      res.json({ accessToken: accessToken, userId: user.id });
    } else {
      res.status(401).json({ message: 'Not Allowed' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;