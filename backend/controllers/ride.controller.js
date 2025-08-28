const { validationResult } = require("express-validator");
const rideService = require("../services/rideService");
const mapsService = require("../services/mapsService");
const hospitalService = require("../services/hospitalService");
const Ride = require("../models/rideModel");

module.exports.createRide = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, vehicleType } = req.body;
    const userId = req.user.id;

    // ✅ Get pickup coordinates
    const pickupCoords = await mapsService.getAddressCoordinates(pickup);
    if (!pickupCoords) {
      return res.status(400).json({ message: "Invalid pickup address" });
    }

    // ✅ Find nearest hospital
    const nearestHospital = await hospitalService(pickupCoords);
    if (!nearestHospital) {
      return res.status(500).json({ message: "No hospitals found nearby" });
    }

    // ✅ Create ride (pending by default)
    let ride = await rideService.createRide({
      userId,
      pickup,
      pickupCoords,
      nearestHospital,
      // fare,
      // distance,
      // duration,
      vehicleType,
    });

    // ✅ Find available captains
    const captainsAvailable = await mapsService.getCaptainsInTheRadius(
      pickupCoords,
      5,
      vehicleType,
    );
    if (captainsAvailable.length === 0) {
      return res.status(400).json({ message: "No captains available nearby" });
    }

    // ✅ Generate OTP
    const otp = "";

    // ✅ Populate references
    ride = await ride
      .populate("user", "-password")
      .populate("captain", "-password")
      .populate("destination");

    res.status(201).json({ ride });
  } catch (error) {
    console.error("Error in createRide controller:", error.message);
    res.status(500).json({ message: error.message });
  }
};
