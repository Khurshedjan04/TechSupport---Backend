const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authenticate token middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token - user not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(500).json({ message: 'Token verification failed' });
  }
};

// Authorize admin middleware
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super admin' && req.user.role !== 'technician') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

module.exports = {
  authenticateToken,
  authorizeAdmin
};