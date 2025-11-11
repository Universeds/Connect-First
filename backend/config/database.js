const mysql = require('mysql2/promise');

// MariaDB/MySQL connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'cfuser',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'connect_first',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test connection
const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✓ MariaDB Connected Successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('✗ MariaDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Helper function to execute queries
const query = async (sql, params) => {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

module.exports = { connectDB, pool, query };
