const User = require('../models/User');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || username.trim() === '') {
      return res.status(400).json({ error: 'Username is required' });
    }

    if (!password || password.trim() === '') {
      return res.status(400).json({ error: 'Password is required' });
    }

    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isPasswordValid = await User.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    await User.updateLastLogin(username);

    req.session.user = { username: user.username, role: user.role };
    
    res.json({ 
      message: 'Login successful',
      user: { username: user.username, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || username.trim() === '') {
      return res.status(400).json({ error: 'Username is required' });
    }

    if (!password || password.trim() === '') {
      return res.status(400).json({ error: 'Password is required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    if (username.toLowerCase() === 'admin') {
      return res.status(400).json({ error: 'Username "admin" is reserved and cannot be registered' });
    }

    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const role = 'helper';
    
    const user = await User.create({ username, password, role });

    req.session.user = { username: user.username, role: user.role };
    
    res.status(201).json({ 
      message: 'Registration successful',
      user: { username: user.username, role: user.role }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
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

module.exports = { login, register, logout, getCurrentUser };
