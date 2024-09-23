require('dotenv').config();

const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware to verify JWT token

// Middleware to check if user is admin


const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
      return res.status(401).send('Access denied');
  }

  try {
      const decoded = jwt.verify(token, 'secret');
      req.user = decoded;
      next();
  } catch (error) {
      res.status(401).send('Invalid token');
  }
};


const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
      return res.status(403).send('Access forbidden');
  }
  next();
};



module.exports = { verifyToken, isAdmin };
