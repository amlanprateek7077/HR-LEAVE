const jwt = require('jsonwebtoken');
const User = require('../models/User');

function auth(requiredRole = null) {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
      if (!token) return res.status(401).json({ message: 'No token' });

      const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
      req.user = await User.findById(payload.id).select('-passwordHash');
      if (!req.user) return res.status(401).json({ message: 'Invalid token user' });

      if (requiredRole && req.user.role !== requiredRole) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Unauthorized', error: err.message });
    }
  };
}

module.exports = { auth };
