const pool = require('../database');

async function getProducts() {
  const [rows] = await pool.query('SELECT * FROM products');
  return rows;
}

async function getProductById(id) {
  const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
  return rows[0];
}

async function addProduct(product) {
    const { title, author, genre, price, description, image } = product;
    const [result] = await pool.query('INSERT INTO products (title, author, genre, price, description, image) VALUES (?, ?, ?, ?, ?, ?)', [title, author, genre, price, description, image]);
    return result.insertId;
}

async function updateProduct(id, product) {
    const { title, author, genre, price, description, image } = product;
    await pool.query('UPDATE products SET title = ?, author = ?, genre = ?, price = ?, description = ?, image = ? WHERE id = ?', [title, author, genre, price, description, image, id]);
}

async function deleteProduct(id) {
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
}

module.exports = { getProducts, getProductById, addProduct, updateProduct, deleteProduct };