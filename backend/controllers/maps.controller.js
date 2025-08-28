const mapsService = require("../services/maps.service");

// Get coordinates from address
module.exports.getCoordinates = async (req, res, next) => {
  try {
    const { address } = req.query;
    if (!address) {
      return res
        .status(400)
        .json({ message: "Address query parameter is required" });
    }
    const coordinates = await mapsService.getAddressCoordinates(address);
    res.status(200).json({ coordinates });
  } catch (error) {
    console.error("Error in getCoordinates controller:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get address from coordinates
module.exports.getAddress = async (req, res, next) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      return res
        .status(400)
        .json({ message: "lat and lng query parameters are required" });
    }
    const address = await mapsService.getCoordinatesAddress(lat, lng);
    res.status(200).json({ address });
  } catch (error) {
    console.error("Error in getAddress controller:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get distance and duration between two points
module.exports.getDistanceAndDuration = async (req, res, next) => {
  try {
    const { originLat, originLng, destLat, destLng } = req.query;
    if (!originLat || !originLng || !destLat || !destLng) {
      return res
        .status(400)
        .json({
          message:
            "originLat, originLng, destLat, and destLng query parameters are required",
        });
    }
    const origin = { lat: originLat, lng: originLng };
    const destination = { lat: destLat, lng: destLng };
    const result = await mapsService.getDistanceAndDuration(
      origin,
      destination,
    );
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getDistanceAndDuration controller:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get auto suggestions for places
module.exports.getPlaceSuggestions = async (req, res, next) => {
  try {
    const { input } = req.query;
    if (!input) {
      return res
        .status(400)
        .json({ message: "input query parameter is required" });
    }
    const suggestions = await mapsService.getAutoSuggestPlaces(input);
    res.status(200).json({ suggestions });
  } catch (error) {
    console.error("Error in getPlaceSuggestions controller:", error.message);
    res.status(500).json({ message: error.message });
  }
};
