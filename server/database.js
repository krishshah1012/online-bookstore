const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'bookstore',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  port: 3305,
});


// Test the connection immediately after creating the pool
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection successful!');
    connection.release(); // Release the connection back to the pool
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

testConnection(); // Call the test function

module.exports = pool;