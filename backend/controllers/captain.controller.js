const captainModel = require('../models/captain.model');
const blacklistTokenModel = require('../models/blacklistToken.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');

// Register Captain
module.exports.registerCaptain = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullname, email, password, vehicle } = req.body;
        const { firstname, lastname } = fullname;
        const { color, plate, capacity, vehicleType } = vehicle;

        // Create new captain(checks for existing captain, hashes password and saves to DB)
        let captain;
        try {
            captain = await captainService.createCaptain({
            firstname, lastname, email, password, color, plate, capacity, vehicleType
            });
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }
        
        // Generate JWT token and send to cookie
        const token = captainService.sendToken(res, captain);

        // Respond with captain and token
        res.status(201).json({ captain, token });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

module.exports.loginCaptain = async (req, res, next) => {
    try {
        // 1. Check express-validator errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
        
        const { email, password } = req.body;

        // 2. Find captain by email
        const captain = await captainModel.findOne({ email }).select('+password');
        if (!captain) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        // 3. Compare passwords
        const isMatch = await captain.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // 4. Generate JWT token and send to cookie
        const token = captainService.sendToken(res, captain);

        // 5. Respond with captain and token
        res.status(200).json({ captain: captain, jwt_token: token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

// Get Captain Profile
module.exports.getCaptainProfile = async (req, res, next) => {
    try {
        const user = req.user; // from authMiddleware
        
        res.status(200).json({ user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
}

// Logout Captain
module.exports.logoutCaptain = async (req, res, next) => {
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