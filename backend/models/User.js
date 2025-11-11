const bcrypt = require('bcryptjs');
const { query } = require('../config/database');

// User model functions
const User = {
  // Find user by username
  async findByUsername(username) {
    const sql = 'SELECT * FROM users WHERE username = ?';
    const results = await query(sql, [username]);
    return results[0] || null;
  },

  // Create new user
  async create(userData) {
    const { username, password, role } = userData;
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const sql = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
    const result = await query(sql, [username, hashedPassword, role]);
    
    return {
      username,
      role,
      lastLogin: new Date()
    };
  },

  // Update last login
  async updateLastLogin(username) {
    const sql = 'UPDATE users SET last_login = NOW() WHERE username = ?';
    await query(sql, [username]);
  },

  // Compare password
  async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
};

module.exports = User;
