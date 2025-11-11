const Basket = require('../models/Basket');
const Need = require('../models/Need');
const Transaction = require('../models/Transaction');

const getBasket = async (req, res) => {
  try {
    const username = req.session.user.username;
    
    const basketItems = await Basket.findByUsername(username);
    
    const formattedItems = basketItems.map(item => ({
      id: item.id,
      quantity: item.quantity,
      created_at: item.created_at,
      name: item.name,
      description: item.description || '',
      cost: parseFloat(item.cost),
      category: item.category,
      priority: item.priority,
      is_time_sensitive: Boolean(item.is_time_sensitive),
      frequency_count: item.frequency_count || 0
    }));
    
    res.json(formattedItems);
  } catch (error) {
    console.error('Error fetching basket:', error);
    res.status(500).json({ error: 'Failed to fetch basket' });
  }
};

const addToBasket = async (req, res) => {
  try {
    const username = req.session.user.username;
    const { need_id, quantity } = req.body;

    if (!need_id || !quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Valid need_id and quantity are required' });
    }

    const need = await Need.findById(need_id);
    if (!need) {
      return res.status(404).json({ error: 'Need not found' });
    }

    if (quantity > need.quantity) {
      return res.status(400).json({ error: 'Requested quantity exceeds available quantity' });
    }

    // Update or create basket item
    await Basket.upsert(username, need_id, quantity);

    res.status(201).json({ message: 'Item added to basket' });
  } catch (error) {
    console.error('Error adding to basket:', error);
    res.status(500).json({ error: 'Failed to add item to basket' });
  }
};

const updateBasketItem = async (req, res) => {
  try {
    const username = req.session.user.username;
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Valid quantity is required' });
    }

    const basketItem = await Basket.findByIdAndUsername(id, username);
    if (!basketItem) {
      return res.status(404).json({ error: 'Basket item not found' });
    }

    if (quantity > basketItem.need_quantity) {
      return res.status(400).json({ error: 'Requested quantity exceeds available quantity' });
    }

    await Basket.updateQuantity(id, quantity);

    res.json({ message: 'Basket item updated' });
  } catch (error) {
    console.error('Error updating basket item:', error);
    res.status(500).json({ error: 'Failed to update basket item' });
  }
};

const removeFromBasket = async (req, res) => {
  try {
    const username = req.session.user.username;
    const { id } = req.params;

    const basketItem = await Basket.findByIdAndUsername(id, username);
    if (!basketItem) {
      return res.status(404).json({ error: 'Basket item not found' });
    }

    await Basket.delete(id);

    res.json({ message: 'Item removed from basket' });
  } catch (error) {
    console.error('Error removing from basket:', error);
    res.status(500).json({ error: 'Failed to remove item from basket' });
  }
};

const checkout = async (req, res) => {
  try {
    const username = req.session.user.username;

    const basketItems = await Basket.findByUsername(username);

    if (basketItems.length === 0) {
      return res.status(400).json({ error: 'Basket is empty' });
    }

    // Verify quantities are still available
    for (const item of basketItems) {
      const need = await Need.findById(item.need_id);
      if (!need) {
        return res.status(400).json({ error: `Need not found for item ${item.name}` });
      }
      if (item.quantity > need.quantity) {
        return res.status(400).json({ 
          error: `Insufficient quantity for ${item.name}` 
        });
      }
    }

    // Process each item
    for (const item of basketItems) {
      // Update need quantity and frequency (decrease quantity, increase frequency)
      await Need.updateQuantityAndFrequency(item.need_id, -item.quantity, 1);

      // Create transaction record
      const totalCost = parseFloat(item.cost) * item.quantity;
      await Transaction.create({
        username,
        needId: item.need_id,
        quantity: item.quantity,
        totalCost
      });
    }

    // Clear basket
    await Basket.deleteAllByUsername(username);

    res.json({ message: 'Checkout successful', itemsFunded: basketItems.length });
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ error: 'Checkout failed' });
  }
};

module.exports = {
  getBasket,
  addToBasket,
  updateBasketItem,
  removeFromBasket,
  checkout
};
