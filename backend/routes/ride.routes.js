const router = require("express").Router();
const { authUser } = require("../middlewares/auth.middleware");
const rideController = require("../controllers/ride.controller");
const { body, query } = require("express-validator");

// Request a new ride
const { body } = require("express-validator");

router.post(
  "/create-ride",
  authUser,
  [
    body("pickup")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Invalid pickup address"),
    body("vehicleType")
      .isString()
      .isIn(["car", "bike", "van"])
      .withMessage("Invalid vehicle type"),
  ],
  rideController.createRide,
);

module.exports = router;
