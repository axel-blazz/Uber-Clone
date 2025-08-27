const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const router = require('express').Router();
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');

router.post('/register', [
    // Validation middlewares can be added here
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('fullname.lastname').optional().isLength({ min: 3 }).withMessage('Last name must be at least 3 characters long'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], 
    // controller function 
userController.registerUser
);

router.post('/login', [
    // Validation middlewares can be added here
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],
    // controller function
userController.loginUser
);

module.exports = router;