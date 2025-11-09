const Basket = require('../models/Basket');
const Need = require('../models/Need');
const Transaction = require('../models/Transaction');

const getBasket = async (req, res) => {
  try {
    const username = req.session.user.username;
    
    const basketItems = await Basket.find({ username }).populate('needId');
    
    const formattedItems = basketItems.map(item => ({
      id: item._id,
      quantity: item.quantity,
      created_at: item.createdAt,
      name: item.needId.name,
      description: item.needId.description,
      cost: item.needId.cost,
      category: item.needId.category,
      priority: item.needId.priority,
      is_time_sensitive: item.needId.isTimeSensitive,
      frequency_count: item.needId.frequencyCount
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
    await Basket.findOneAndUpdate(
      { username, needId: need_id },
      { quantity },
      { upsert: true, new: true }
    );

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

    const basketItem = await Basket.findOne({ _id: id, username }).populate('needId');
    if (!basketItem) {
      return res.status(404).json({ error: 'Basket item not found' });
    }

    if (quantity > basketItem.needId.quantity) {
      return res.status(400).json({ error: 'Requested quantity exceeds available quantity' });
    }

    basketItem.quantity = quantity;
    await basketItem.save();

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

    const result = await Basket.deleteOne({ _id: id, username });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Basket item not found' });
    }

    res.json({ message: 'Item removed from basket' });
  } catch (error) {
    console.error('Error removing from basket:', error);
    res.status(500).json({ error: 'Failed to remove item from basket' });
  }
};

const checkout = async (req, res) => {
  try {
    const username = req.session.user.username;

    const basketItems = await Basket.find({ username }).populate('needId');

    if (basketItems.length === 0) {
      return res.status(400).json({ error: 'Basket is empty' });
    }

    // Verify quantities are still available
    for (const item of basketItems) {
      if (item.quantity > item.needId.quantity) {
        return res.status(400).json({ 
          error: `Insufficient quantity for ${item.needId.name}` 
        });
      }
    }

    // Process each item
    for (const item of basketItems) {
      // Update need quantity and frequency
      await Need.findByIdAndUpdate(item.needId._id, {
        $inc: { 
          quantity: -item.quantity,
          frequencyCount: 1
        }
      });

      // Create transaction record
      const totalCost = item.needId.cost * item.quantity;
      await Transaction.create({
        username,
        needId: item.needId._id,
        quantity: item.quantity,
        totalCost
      });
    }

    // Clear basket
    await Basket.deleteMany({ username });

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
