// controllers/authController.js
const { validationResult } = require('express-validator');
const userService = require('../services/user.service');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');
const blacklistTokenModel = require('../models/blacklistToken.model');


// Register User
module.exports.registerUser = async (req, res, next) => {
  try {
    // 1. Check express-validator errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;
    const { firstname, lastname } = fullname;

    // 2. Call service to create user
    const user = await userService.createUser({ firstname, lastname, email, password });

    // 3. Generate JWT token and send to cookie
    const token = userService.sendToken(res, user);

    // 4. Respond with user and token
    res.status(201).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Login User
module.exports.loginUser = async (req, res, next) => {
    try {
        // 1. Check express-validator errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
        
        const { email, password } = req.body;

        // 2. Find user by email
        const user = await UserModel.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        // 3. Compare passwords
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // 4. Generate JWT token and send to cookie
        const token = userService.sendToken(res, user);

        // 5. Respond with user and token
        res.status(200).json({ user: user, jwt_token: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

// Get User Profile
module.exports.getUserProfile = async (req, res, next) => {
    try {
        const user = req.user; // from authMiddleware
        console.log(req.cookies);
        
        res.status(200).json({ user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
}

// Logout User
module.exports.logoutUser = async (req, res, next) => {
    try {
        // Clear the token from cookie cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        });
        const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
        if (token) {
            await blacklistTokenModel.create({ token });
        }
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

