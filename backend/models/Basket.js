const { query } = require('../config/database');

// Basket model functions
const Basket = {
  // Find all basket items for a user
  async findByUsername(username) {
    const sql = `SELECT b.*, n.name, n.description, n.cost, n.category, n.priority, 
                        n.is_time_sensitive, n.frequency_count
                 FROM baskets b
                 INNER JOIN needs n ON b.need_id = n.id
                 WHERE b.username = ?`;
    return await query(sql, [username]);
  },

  // Find basket item by ID and username
  async findByIdAndUsername(id, username) {
    const sql = `SELECT b.*, n.name, n.description, n.cost, n.category, n.priority,
                        n.is_time_sensitive, n.frequency_count, n.quantity as need_quantity
                 FROM baskets b
                 INNER JOIN needs n ON b.need_id = n.id
                 WHERE b.id = ? AND b.username = ?`;
    const results = await query(sql, [id, username]);
    return results[0] || null;
  },

  // Find basket item by username and need_id
  async findByUsernameAndNeedId(username, needId) {
    const sql = `SELECT b.*, n.name, n.description, n.cost, n.category, n.priority,
                        n.is_time_sensitive, n.frequency_count, n.quantity as need_quantity
                 FROM baskets b
                 INNER JOIN needs n ON b.need_id = n.id
                 WHERE b.username = ? AND b.need_id = ?`;
    const results = await query(sql, [username, needId]);
    return results[0] || null;
  },

  // Create or update basket item
  async upsert(username, needId, quantity) {
    const sql = `INSERT INTO baskets (username, need_id, quantity) 
                 VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE quantity = VALUES(quantity)`;
    await query(sql, [username, needId, quantity]);
    return await this.findByUsernameAndNeedId(username, needId);
  },

  // Update basket item quantity
  async updateQuantity(id, quantity) {
    const sql = 'UPDATE baskets SET quantity = ? WHERE id = ?';
    await query(sql, [quantity, id]);
    return true;
  },

  // Delete basket item
  async delete(id) {
    const sql = 'DELETE FROM baskets WHERE id = ?';
    await query(sql, [id]);
    return true;
  },

  // Delete all basket items for a user
  async deleteAllByUsername(username) {
    const sql = 'DELETE FROM baskets WHERE username = ?';
    await query(sql, [username]);
    return true;
  }
};

module.exports = Basket;
