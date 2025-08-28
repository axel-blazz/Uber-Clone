const Hospital = require('../models/hospital.model');
const mapsService = require('../services/maps.service');

module.exports.findNearestHospital = async (pickupCoords) => {
  const hospitals = await Hospital.find(); // all hospitals

  let nearestHospital = null;
  let minDistance = Infinity;

  for (let hospital of hospitals) {
    const result = await mapsService.getDistanceAndDuration(
      pickupCoords,
      hospital.location // { lat, lng } from DB
    );

    if (result.distance < minDistance) {
      minDistance = result.distance;
      nearestHospital = { ...hospital.toObject(), distance: result.distance, duration: result.duration };
    }
  }

  return nearestHospital;
}
// Example return value:
// {
//   _id: "...",
//   name: "City Hospital",
//   location: { lat: ..., lng: ... },
//   capacity: 50,
//   distance: 1200, // in meters
//   duration: 300   // in seconds
// }
