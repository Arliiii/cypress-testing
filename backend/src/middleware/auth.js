import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      if (!req.user.isActive) {
        return res.status(401).json({ message: 'User account is deactivated' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error in authentication' });
  }
};

export const checkCredits = (creditsRequired) => {
  return (req, res, next) => {
    if (req.user.credits < creditsRequired) {
      return res.status(403).json({ 
        message: 'Insufficient credits',
        required: creditsRequired,
        available: req.user.credits
      });
    }
    next();
  };
};
