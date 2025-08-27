// controllers/authController.js
const { validationResult } = require('express-validator');
const userService = require('../services/user.service');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');


// Register User
module.exports.registerUser = async (req, res) => {
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
    res.status(400).json({ message: error.message });
  }
};

// Login User
module.exports.loginUser = async (req, res) => {
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
        res.status(400).json({ message: error.message });
    }
}

