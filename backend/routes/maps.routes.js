const router = require('express').Router();
const { authUser } = require('../middlewares/auth.middleware');
const mapsController = require('../controllers/maps.controller');

// Get coordinates from address
router.get('/get-coordinates', authUser, mapsController.getCoordinates);

// Get address from coordinates
router.get('/get-address', authUser, mapsController.getAddress);

module.exports = router;