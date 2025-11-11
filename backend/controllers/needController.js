const Need = require('../models/Need');
const Transaction = require('../models/Transaction');

// Helper function to format need for API response
const formatNeed = (need) => {
  return {
    id: need.id,
    name: need.name,
    description: need.description || '',
    cost: parseFloat(need.cost),
    quantity: need.quantity,
    category: need.category,
    priority: need.priority,
    is_time_sensitive: Boolean(need.is_time_sensitive),
    deadline: need.deadline || null,
    frequency_count: need.frequency_count || 0,
    created_at: need.created_at,
    updated_at: need.updated_at,
    address: need.address || '',
    latitude: need.latitude ? parseFloat(need.latitude) : null,
    longitude: need.longitude ? parseFloat(need.longitude) : null
  };
};

// Helper function to calculate funding progress for a need
const calculateProgress = async (need) => {
  try {
    // Get all transactions for this need
    const transactions = await Transaction.findByNeedId(need.id);
    
    // Calculate amount raised (sum of all transaction costs)
    const amountRaised = transactions.reduce((sum, transaction) => {
      return sum + parseFloat(transaction.total_cost || 0);
    }, 0);
    
    // Calculate amount left (remaining quantity * cost per unit)
    const amountLeft = need.quantity * parseFloat(need.cost);
    
    // Calculate total goal (amount raised + amount left)
    const totalGoal = amountRaised + amountLeft;
    
    // Calculate progress percentage
    const progressPercentage = totalGoal > 0 ? (amountRaised / totalGoal) * 100 : 0;
    
    return {
      amountRaised: Math.round(amountRaised * 100) / 100,
      amountLeft: Math.round(amountLeft * 100) / 100,
      totalGoal: Math.round(totalGoal * 100) / 100,
      progressPercentage: Math.round(progressPercentage * 10) / 10
    };
  } catch (error) {
    console.error('Error calculating progress:', error);
    return {
      amountRaised: 0,
      amountLeft: need.quantity * parseFloat(need.cost),
      totalGoal: need.quantity * parseFloat(need.cost),
      progressPercentage: 0
    };
  }
};

const getAllNeeds = async (req, res) => {
  try {
    const needs = await Need.findAll();
    
    // Calculate progress for each need
    const needsWithProgress = await Promise.all(
      needs.map(async (need) => {
        const formattedNeed = formatNeed(need);
        const progress = await calculateProgress(need);
        return { ...formattedNeed, ...progress };
      })
    );
    
    res.json(needsWithProgress);
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
    
    const formattedNeed = formatNeed(need);
    const progress = await calculateProgress(need);
    
    res.json({ ...formattedNeed, ...progress });
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
    
    const needs = await Need.search(q);
    
    // Calculate progress for each need
    const needsWithProgress = await Promise.all(
      needs.map(async (need) => {
        const formattedNeed = formatNeed(need);
        const progress = await calculateProgress(need);
        return { ...formattedNeed, ...progress };
      })
    );
    
    res.json(needsWithProgress);
  } catch (error) {
    console.error('Error searching needs:', error);
    res.status(500).json({ error: 'Failed to search needs' });
  }
};

const getNeedsByPriority = async (req, res) => {
  try {
    const needs = await Need.findAll('priority');
    
    // Calculate progress for each need
    const needsWithProgress = await Promise.all(
      needs.map(async (need) => {
        const formattedNeed = formatNeed(need);
        const progress = await calculateProgress(need);
        return { ...formattedNeed, ...progress };
      })
    );
    
    res.json(needsWithProgress);
  } catch (error) {
    console.error('Error fetching needs by priority:', error);
    res.status(500).json({ error: 'Failed to fetch needs' });
  }
};

const getNeedsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const needs = await Need.findByCategory(category);
    
    // Calculate progress for each need
    const needsWithProgress = await Promise.all(
      needs.map(async (need) => {
        const formattedNeed = formatNeed(need);
        const progress = await calculateProgress(need);
        return { ...formattedNeed, ...progress };
      })
    );
    
    res.json(needsWithProgress);
  } catch (error) {
    console.error('Error fetching needs by category:', error);
    res.status(500).json({ error: 'Failed to fetch needs' });
  }
};

const createNeed = async (req, res) => {
  try {
    const { name, description, cost, quantity, category, priority, is_time_sensitive, deadline, address, latitude, longitude } = req.body;

    if (!name || !cost || !quantity) {
      return res.status(400).json({ error: 'Name, cost, and quantity are required' });
    }

    const need = await Need.create({
      name,
      description: description || '',
      cost,
      quantity,
      category: category || 'Other',
      priority: priority || 'Medium',
      isTimeSensitive: is_time_sensitive || false,
      deadline: deadline || null,
      address: address || '',
      latitude: latitude || null,
      longitude: longitude || null
    });

    const formattedNeed = formatNeed(need);
    const progress = await calculateProgress(need);
    
    res.status(201).json({ ...formattedNeed, ...progress });
  } catch (error) {
    console.error('Error creating need:', error);
    res.status(500).json({ error: 'Failed to create need' });
  }
};

const updateNeed = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, cost, quantity, category, priority, is_time_sensitive, deadline, address, latitude, longitude } = req.body;

    const need = await Need.update(id, {
      name,
      description,
      cost,
      quantity,
      category,
      priority,
      isTimeSensitive: is_time_sensitive,
      deadline,
      address,
      latitude,
      longitude
    });

    if (!need) {
      return res.status(404).json({ error: 'Need not found' });
    }

    const formattedNeed = formatNeed(need);
    const progress = await calculateProgress(need);

    res.json({ ...formattedNeed, ...progress });
  } catch (error) {
    console.error('Error updating need:', error);
    res.status(500).json({ error: 'Failed to update need' });
  }
};

const deleteNeed = async (req, res) => {
  try {
    const { id } = req.params;

    const need = await Need.findById(id);
    if (!need) {
      return res.status(404).json({ error: 'Need not found' });
    }

    await Need.delete(id);

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
