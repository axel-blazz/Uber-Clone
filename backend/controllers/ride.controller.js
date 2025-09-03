const { validationResult } = require("express-validator");
const rideService = require("../services/ride.service");
// const mapsService = require("../services/maps.service");
const pushNotificationService = require("../services/pushNotification.service");
const { sendMessageToSocketId } = require("../socket");
const captainModel = require("../models/captain.model");
const RideModel = require("../models/ride.model");

module.exports.createRide = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, vehicleType } = req.body;
    const userId = req.user._id;

    // ✅ Create ride (pending by default)
    let { rideId , pickupCoords } = await rideService.createRide({
      userId,
      pickup,
      vehicleType,
    });

    // ✅ Find available captains
    // const captainsAvailable = await mapsService.getCaptainsInTheRadius(
    //   pickupCoords,
    //   5,
    //   vehicleType,
    // );
    const mockCaptains = await captainModel.find({ status: "active" });

    const captainsAvailable = mockCaptains.filter(
      (c) => c.vehicle.vehicleType === vehicleType
    );
    if (captainsAvailable.length === 0) {
      return res.status(400).json({ message: "No captains available nearby" });
    }


    // ✅ Populate references
    const ride = await RideModel.findById(rideId)
      .populate("user", "-password")
      .populate("destination")
      .exec();

    
    console.log("Ride created:", ride);
    



    // Notify all available
    for (const captain of captainsAvailable) {
      if (captain.socketId) {
        // Online captain → WebSocket
        sendMessageToSocketId(captain.socketId, {
          event: "new-ride-request",
          data: { ride },
        });
        console.log("Sent WebSocket ride request to captain:", captain._id);
      } 
      if (captain.deviceToken) {
        // Offline captain → Push Notification
        try {
          await pushNotificationService.sendPushNotification(
            captain.deviceToken,
            "New Emergency Ride Request",
            "A patient nearby needs a ride to the hospital.",
            { rideId: ride._id.toString() }
          );
          console.log("Sent push notif to captain:", captain._id);
        } catch (err) {
          console.error(
            "Error sending push notif to captain:",
            captain._id,
            err
          );
        }
      }
    }


    res.status(201).json({ ride });
  } catch (error) {
    console.error("Error in createRide controller:", error.message);
    res.status(500).json({ message: error.message });
  }
};
