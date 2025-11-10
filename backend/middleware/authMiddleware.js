const authMiddleware = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
};

const managerOnly = (req, res, next) => {
  if (!req.session || !req.session.user || req.session.user.role !== 'manager') {
    return res.status(403).json({ error: 'Access denied. Manager only.' });
  }
  next();
};

const helperOnly = (req, res, next) => {
  if (!req.session || !req.session.user || req.session.user.role !== 'helper') {
    return res.status(403).json({ error: 'Access denied. Helper only.' });
  }
  next();
};

module.exports = { authMiddleware, managerOnly, helperOnly };
