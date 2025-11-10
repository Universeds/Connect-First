const express = require('express');
const router = express.Router();
const { authMiddleware, managerOnly } = require('../middleware/authMiddleware');
const {
  getAllNeeds,
  getNeedById,
  searchNeeds,
  getNeedsByPriority,
  getNeedsByCategory,
  createNeed,
  updateNeed,
  deleteNeed
} = require('../controllers/needController');

router.get('/', authMiddleware, getAllNeeds);
router.get('/search', authMiddleware, searchNeeds);
router.get('/priority', authMiddleware, getNeedsByPriority);
router.get('/category/:category', authMiddleware, getNeedsByCategory);
router.get('/:id', authMiddleware, getNeedById);
router.post('/', authMiddleware, managerOnly, createNeed);
router.put('/:id', authMiddleware, managerOnly, updateNeed);
router.delete('/:id', authMiddleware, managerOnly, deleteNeed);

module.exports = router;
