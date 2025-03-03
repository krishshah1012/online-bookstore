const pool = require('../database');
const bcrypt = require('bcrypt');

async function createUser(user) {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const [result] = await pool.query('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [user.username, hashedPassword, user.email]);
  return result.insertId;
}

async function getUserByUsername(username) {
  const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0];
}

module.exports = { createUser, getUserByUsername };