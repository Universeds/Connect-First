const { query } = require('../config/database');

// Need model functions
const Need = {
  // Find all needs
  async findAll(sortBy = 'priority') {
    let sql = 'SELECT * FROM needs';
    
    if (sortBy === 'priority') {
      // Order by priority (High=3, Medium=2, Low=1), then time-sensitive, then frequency, then date
      sql += ` ORDER BY 
        CASE priority 
          WHEN 'High' THEN 3 
          WHEN 'Medium' THEN 2 
          WHEN 'Low' THEN 1 
        END DESC,
        is_time_sensitive DESC, 
        frequency_count DESC, 
        created_at DESC`;
    } else {
      sql += ' ORDER BY created_at DESC';
    }
    
    return await query(sql);
  },

  // Find need by ID
  async findById(id) {
    const sql = 'SELECT * FROM needs WHERE id = ?';
    const results = await query(sql, [id]);
    return results[0] || null;
  },

  // Search needs
  async search(searchQuery) {
    const sql = `SELECT * FROM needs 
                 WHERE name LIKE ? OR description LIKE ? 
                 ORDER BY 
                   CASE priority 
                     WHEN 'High' THEN 3 
                     WHEN 'Medium' THEN 2 
                     WHEN 'Low' THEN 1 
                   END DESC,
                   is_time_sensitive DESC`;
    const searchTerm = `%${searchQuery}%`;
    return await query(sql, [searchTerm, searchTerm]);
  },

  // Find by category
  async findByCategory(category) {
    const sql = `SELECT * FROM needs 
                 WHERE category = ? 
                 ORDER BY 
                   CASE priority 
                     WHEN 'High' THEN 3 
                     WHEN 'Medium' THEN 2 
                     WHEN 'Low' THEN 1 
                   END DESC,
                   is_time_sensitive DESC`;
    return await query(sql, [category]);
  },

  // Create need
  async create(needData) {
    const {
      name,
      description = '',
      cost,
      quantity,
      category = 'Other',
      priority = 'Medium',
      isTimeSensitive = false,
      deadline = null,
      address = '',
      latitude = null,
      longitude = null
    } = needData;

    const sql = `INSERT INTO needs 
                 (name, description, cost, quantity, category, priority, is_time_sensitive, deadline, address, latitude, longitude) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const result = await query(sql, [
      name, description, cost, quantity, category, priority, 
      isTimeSensitive ? 1 : 0, deadline, address, latitude, longitude
    ]);

    return await this.findById(result.insertId);
  },

  // Update need
  async update(id, needData) {
    const {
      name,
      description,
      cost,
      quantity,
      category,
      priority,
      isTimeSensitive,
      deadline,
      address,
      latitude,
      longitude
    } = needData;

    const sql = `UPDATE needs SET 
                 name = ?, description = ?, cost = ?, quantity = ?, category = ?, 
                 priority = ?, is_time_sensitive = ?, deadline = ?, address = ?, 
                 latitude = ?, longitude = ?, updated_at = NOW()
                 WHERE id = ?`;
    
    await query(sql, [
      name, description, cost, quantity, category, priority,
      isTimeSensitive ? 1 : 0, deadline, address, latitude, longitude, id
    ]);

    return await this.findById(id);
  },

  // Delete need
  async delete(id) {
    const sql = 'DELETE FROM needs WHERE id = ?';
    await query(sql, [id]);
    return true;
  },

  // Update quantity and frequency
  async updateQuantityAndFrequency(id, quantityChange, frequencyIncrement = 1) {
    const sql = `UPDATE needs 
                 SET quantity = quantity + ?, 
                     frequency_count = frequency_count + ?,
                     updated_at = NOW()
                 WHERE id = ?`;
    await query(sql, [quantityChange, frequencyIncrement, id]);
  }
};

module.exports = Need;
