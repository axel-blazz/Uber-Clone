const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');
const blacklistTokenModel = require('../models/blacklistToken.model');

const authMiddleware = async (req, res, next) => {
  try {
    // 1️⃣ Get token from cookie or Authorization header
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Authorization denied' });
    }

    // Blacklist token check can be added here if needed
    const isBlacklisted = await blacklistTokenModel.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({ message: 'Token has been revoked' });
    }
        
    // 2️⃣ Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      
    } catch (err) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    
    // 3️⃣ Fetch user and attach to req
    const user = await UserModel.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user; // attach user to request
    next(); // move to the next middleware or route handler
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = authMiddleware;
