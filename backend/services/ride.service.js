const rideModel = require("../models/ride.model");
const mapsService = require("./maps.service");
const hospitalService = require("./hospital.service");
const crypto = require("crypto");

module.exports.createRide = async ({
  userId,
  pickup,
  vehicleType
}) => {
  if (!userId || !pickup || !vehicleType) {
    throw new Error("Missing required fields to create a ride");
  }

// ✅ Get pickup coordinates
  const pickupCoords = await mapsService.getAddressCoordinates(pickup);
  if (!pickupCoords) {
    return res.status(400).json({ message: "Invalid pickup address" });
  }

  // ✅ Find nearest hospital
  const nearestHospital = await hospitalService.findNearestHospital(pickupCoords);
  if (!nearestHospital) {
    return res.status(500).json({ message: "No hospitals found nearby" });
  }

  // Calculate fare, distance, duration
  const { fare, distance, duration } = await this.calculateFare(
    pickupCoords,
    nearestHospital,
    vehicleType,
  );

  // Create and save ride
  const ride = await rideModel.create({
    user: userId,
    pickup,
    destination: nearestHospital._id,
    fare,
    distance,
    otp: generateOTP(6),
    duration,
  });
  return { rideId: ride._id, pickupCoords };
};

module.exports.calculateFare = async (
  pickupCoords,
  nearestHospital,
  vehicleType,
) => {
  const { distance, duration } = await mapsService.getDistanceAndDuration(
    pickupCoords,
    nearestHospital.location,
  );
  // Simple fare calculation based on every type of vehicle
  const basefare =
    vehicleType === "bike" ? 30 : vehicleType === "car" ? 50 : 100;
  const perKm = vehicleType === "bike" ? 10 : vehicleType === "car" ? 20 : 40;
  const fare = basefare + (distance / 1000) * perKm;
  return { fare, distance, duration };
};

// Confirm ride
module.exports.confirmRide = async (rideId, captain) => {
  if (!rideId || !captain) {
    throw new Error("Missing rideId or captain to confirm ride");
  }

  const ride = await rideModel
    .findOneAndUpdate(
      { _id: rideId, status: "pending" }, // only if still pending
      { status: "accepted", captain: captain._id },
      { new: true } // return updated doc
    )
    .populate("user", "-password")
    .populate("captain", "-password")
    .populate("destination")
    .select("+otp");
  if (!ride) {
    throw new Error("Ride not found or already accepted/cancelled");
  }
  return ride;
};

function generateOTP(num) {
    const digits = "0123456789";
    let otp = "";
    for (let i = 0; i < num; i++) {
        const randIndex = crypto.randomInt(0, digits.length);
        otp += digits[randIndex];
    }
    return otp;
}
