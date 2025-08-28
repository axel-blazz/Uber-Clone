const rideModel = require("../models/ride.model");
const mapsService = require("./maps.service");

module.exports.createRide = async ({
  userId,
  pickup,
  pickupCoords,
  nearestHospital,
  vehicleType
}) => {
  if (!userId || !pickup || !nearestHospital || !vehicleType) {
    throw new Error("Missing required fields to create a ride");
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
    duration,
  });
  return ride;
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

  await rideModel.findOneAndUpdate(
    { _id: rideId, status: "pending" },
    { status: "accepted", captain: captain._id },
  );

  const ride = await rideModel
    .findById(rideId)
    .populate("user", "-password")
    .populate("captain", "-password")
    .populate("destination")
    .select("+otp");
  return ride;
};
