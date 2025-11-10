const express = require('express');
const router = express.Router();
const { authMiddleware, helperOnly } = require('../middleware/authMiddleware');
const {
  getBasket,
  addToBasket,
  updateBasketItem,
  removeFromBasket,
  checkout
} = require('../controllers/basketController');

router.get('/', authMiddleware, helperOnly, getBasket);
router.post('/', authMiddleware, helperOnly, addToBasket);
router.put('/:id', authMiddleware, helperOnly, updateBasketItem);
router.delete('/:id', authMiddleware, helperOnly, removeFromBasket);
router.post('/checkout', authMiddleware, helperOnly, checkout);

module.exports = router;
