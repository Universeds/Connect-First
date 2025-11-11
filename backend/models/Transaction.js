const { query } = require('../config/database');

// Transaction model functions
const Transaction = {
  // Find all transactions for a need
  async findByNeedId(needId) {
    const sql = 'SELECT * FROM transactions WHERE need_id = ?';
    return await query(sql, [needId]);
  },

  // Find all transactions for a user
  async findByUsername(username) {
    const sql = 'SELECT * FROM transactions WHERE username = ? ORDER BY transaction_date DESC';
    return await query(sql, [username]);
  },

  // Create transaction
  async create(transactionData) {
    const { username, needId, quantity, totalCost } = transactionData;
    
    const sql = `INSERT INTO transactions (username, need_id, quantity, total_cost) 
                 VALUES (?, ?, ?, ?)`;
    
    const result = await query(sql, [username, needId, quantity, totalCost]);
    return await this.findById(result.insertId);
  },

  // Find transaction by ID
  async findById(id) {
    const sql = 'SELECT * FROM transactions WHERE id = ?';
    const results = await query(sql, [id]);
    return results[0] || null;
  }
};

module.exports = Transaction;
