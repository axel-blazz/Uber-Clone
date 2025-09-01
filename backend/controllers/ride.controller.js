const { validationResult } = require("express-validator");
const rideService = require("../services/ride.service");
const mapsService = require("../services/maps.service");
const pushNotificationService = require("../services/pushNotification.service");
const { sendMessageToSocketId } = require("../socket");

module.exports.createRide = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, vehicleType } = req.body;
    const userId = req.user._id;

    // ✅ Create ride (pending by default)
    let { ride, pickupCoords } = await rideService.createRide({
      userId,
      pickup,
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


    // ✅ Populate references
    ride = await ride
      .populate("user", "-password")
      .populate("destination")
      .select("-otp");

    // Notify all available
    captainsAvailable.map((captain) => {
      // Notify each captain about the new ride request
      sendMessageToSocketId(captain.socketId, {
        event: "new-ride-request",
        data: { ride },
      });
    });

    if(captainsAvailable.deviceToken){
      // Send push notification to all available captains
      pushNotificationService.sendPushNotification(captainsAvailable.deviceToken, {
        title: "New Ride Request",
        body: `Pickup at ${pickup}`,
        data: { rideId: ride._id.toString() },
      });
    }

    res.status(201).json({ ride });
  } catch (error) {
    console.error("Error in createRide controller:", error.message);
    res.status(500).json({ message: error.message });
  }
};
