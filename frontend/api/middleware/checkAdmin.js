const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware to verify admin role
const checkAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'No token provided.' });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    // Check if user is admin
    if (user && user.role === 'admin') {
      req.user = user;
      next();
    } else {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = checkAdmin;
