const User = require('../models/User');

const login = async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username || username.trim() === '') {
      return res.status(400).json({ error: 'Username is required' });
    }

    const role = username === 'admin' ? 'manager' : 'helper';
    
    // Find or create user
    let user = await User.findOne({ username });
    if (!user) {
      user = await User.create({ username, role });
    } else {
      user.lastLogin = Date.now();
      await user.save();
    }

    req.session.user = { username, role };
    
    res.json({ 
      message: 'Login successful',
      user: { username, role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logout successful' });
  });
};

const getCurrentUser = (req, res) => {
  if (req.session && req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
};

module.exports = { login, logout, getCurrentUser };
