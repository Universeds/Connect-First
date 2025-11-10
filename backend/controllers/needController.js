const Need = require('../models/Need');

const getAllNeeds = async (req, res) => {
  try {
    const needs = await Need.find()
      .sort({ priority: -1, isTimeSensitive: -1, createdAt: -1 });
    
    // Convert to match frontend expectations
    const needsWithSnakeCase = needs.map(need => ({
      id: need._id,
      name: need.name,
      description: need.description,
      cost: need.cost,
      quantity: need.quantity,
      category: need.category,
      priority: need.priority,
      is_time_sensitive: need.isTimeSensitive,
      frequency_count: need.frequencyCount,
      created_at: need.createdAt,
      updated_at: need.updatedAt
    }));
    
    res.json(needsWithSnakeCase);
  } catch (error) {
    console.error('Error fetching needs:', error);
    res.status(500).json({ error: 'Failed to fetch needs' });
  }
};

const getNeedById = async (req, res) => {
  try {
    const need = await Need.findById(req.params.id);
    if (!need) {
      return res.status(404).json({ error: 'Need not found' });
    }
    
    res.json({
      id: need._id,
      name: need.name,
      description: need.description,
      cost: need.cost,
      quantity: need.quantity,
      category: need.category,
      priority: need.priority,
      is_time_sensitive: need.isTimeSensitive,
      frequency_count: need.frequencyCount,
      created_at: need.createdAt,
      updated_at: need.updatedAt
    });
  } catch (error) {
    console.error('Error fetching need:', error);
    res.status(500).json({ error: 'Failed to fetch need' });
  }
};

const searchNeeds = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const needs = await Need.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    }).sort({ priority: -1, isTimeSensitive: -1 });
    
    const needsWithSnakeCase = needs.map(need => ({
      id: need._id,
      name: need.name,
      description: need.description,
      cost: need.cost,
      quantity: need.quantity,
      category: need.category,
      priority: need.priority,
      is_time_sensitive: need.isTimeSensitive,
      frequency_count: need.frequencyCount,
      created_at: need.createdAt,
      updated_at: need.updatedAt
    }));
    
    res.json(needsWithSnakeCase);
  } catch (error) {
    console.error('Error searching needs:', error);
    res.status(500).json({ error: 'Failed to search needs' });
  }
};

const getNeedsByPriority = async (req, res) => {
  try {
    const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
    const needs = await Need.find();
    
    const sortedNeeds = needs.sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      if (a.isTimeSensitive !== b.isTimeSensitive) {
        return b.isTimeSensitive ? 1 : -1;
      }
      return b.frequencyCount - a.frequencyCount;
    });
    
    const needsWithSnakeCase = sortedNeeds.map(need => ({
      id: need._id,
      name: need.name,
      description: need.description,
      cost: need.cost,
      quantity: need.quantity,
      category: need.category,
      priority: need.priority,
      is_time_sensitive: need.isTimeSensitive,
      frequency_count: need.frequencyCount,
      created_at: need.createdAt,
      updated_at: need.updatedAt
    }));
    
    res.json(needsWithSnakeCase);
  } catch (error) {
    console.error('Error fetching needs by priority:', error);
    res.status(500).json({ error: 'Failed to fetch needs' });
  }
};

const getNeedsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const needs = await Need.find({ category })
      .sort({ priority: -1, isTimeSensitive: -1 });
    
    const needsWithSnakeCase = needs.map(need => ({
      id: need._id,
      name: need.name,
      description: need.description,
      cost: need.cost,
      quantity: need.quantity,
      category: need.category,
      priority: need.priority,
      is_time_sensitive: need.isTimeSensitive,
      frequency_count: need.frequencyCount,
      created_at: need.createdAt,
      updated_at: need.updatedAt
    }));
    
    res.json(needsWithSnakeCase);
  } catch (error) {
    console.error('Error fetching needs by category:', error);
    res.status(500).json({ error: 'Failed to fetch needs' });
  }
};

const createNeed = async (req, res) => {
  try {
    const { name, description, cost, quantity, category, priority, is_time_sensitive, address, latitude, longitude } = req.body;

    if (!name || !cost || !quantity) {
      return res.status(400).json({ error: 'Name, cost, and quantity are required' });
    }

    // TODO: Implement geocoding to get latitude and longitude from address if not provided

    const need = await Need.create({
      name,
      description: description || '',
      cost,
      quantity,
      category: category || 'Other',
      priority: priority || 'Medium',
      isTimeSensitive: is_time_sensitive || false,
      address: address || '',
      latitude,
      longitude
    });

    res.status(201).json({
      id: need._id,
      name: need.name,
      description: need.description,
      cost: need.cost,
      quantity: need.quantity,
      category: need.category,
      priority: need.priority,
      is_time_sensitive: need.isTimeSensitive,
      frequency_count: need.frequencyCount,
      created_at: need.createdAt,
      updated_at: need.updatedAt,
      address: need.address,
      latitude: need.latitude,
      longitude: need.longitude
    });
  } catch (error) {
    console.error('Error creating need:', error);
    res.status(500).json({ error: 'Failed to create need' });
  }
};

const updateNeed = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, cost, quantity, category, priority, is_time_sensitive, address, latitude, longitude } = req.body;

    // TODO: Implement geocoding to get latitude and longitude from address if not provided

    const need = await Need.findByIdAndUpdate(
      id,
      {
        name,
        description,
        cost,
        quantity,
        category,
        priority,
        isTimeSensitive: is_time_sensitive,
        address,
        latitude,
        longitude
      },
      { new: true, runValidators: true }
    );

    if (!need) {
      return res.status(404).json({ error: 'Need not found' });
    }

    res.json({
      id: need._id,
      name: need.name,
      description: need.description,
      cost: need.cost,
      quantity: need.quantity,
      category: need.category,
      priority: need.priority,
      is_time_sensitive: need.isTimeSensitive,
      frequency_count: need.frequencyCount,
      created_at: need.createdAt,
      updated_at: need.updatedAt,
      address: need.address,
      latitude: need.latitude,
      longitude: need.longitude
    });
  } catch (error) {
    console.error('Error updating need:', error);
    res.status(500).json({ error: 'Failed to update need' });
  }
};

const deleteNeed = async (req, res) => {
  try {
    const { id } = req.params;

    const need = await Need.findByIdAndDelete(id);
    if (!need) {
      return res.status(404).json({ error: 'Need not found' });
    }

    res.json({ message: 'Need deleted successfully' });
  } catch (error) {
    console.error('Error deleting need:', error);
    res.status(500).json({ error: 'Failed to delete need' });
  }
};

module.exports = {
  getAllNeeds,
  getNeedById,
  searchNeeds,
  getNeedsByPriority,
  getNeedsByCategory,
  createNeed,
  updateNeed,
  deleteNeed
};
