const express = require('express');
const router = express.Router();
const { login, register, logout, getCurrentUser } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/current', getCurrentUser);

module.exports = router;
