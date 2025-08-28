const axios = require("axios");
const captainModel = require("../models/captain.model");
const API_KEY = process.env.MAPS_API_KEY;

module.exports.getAddressCoordinates = async (address) => {
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address: address,
          key: API_KEY,
        },
      },
    );
    if (response.data.status !== "OK") {
      throw new Error("Error fetching coordinates");
    }
    const location = response.data.results[0].geometry.location;
    return {
      lat: location.lat,
      lng: location.lng,
    }; // { lat: ..., lng: ... }
  } catch (error) {
    console.error("Error in getAddressCoordinates:", error.message);
    throw error;
  }
};

module.exports.getCoordinatesAddress = async (lat, lng) => {
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          latlng: `${lat},${lng}`,
          key: API_KEY,
        },
      },
    );
    if (response.data.status !== "OK") {
      throw new Error("Error fetching address");
    }
    const address = response.data.results[0].formatted_address;
    return address; // "123 Main St, City, Country"
  } catch (error) {
    console.error("Error in getCoordinatesAddress:", error.message);
    throw error;
  }
};

module.exports.getDistanceAndDuration = async (origin, destination) => {
  try {
    if (!origin || !destination) {
      throw new Error("Origin and destination are required");
    }
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/distancematrix/json",
      {
        params: {
          origins: `${origin.lat},${origin.lng}`,
          destinations: `${destination.lat},${destination.lng}`,
          key: API_KEY,
        },
      },
    );
    if (response.data.status !== "OK") {
      throw new Error("Error fetching distance matrix");
    }
    const element = response.data.rows[0].elements[0];
    if (element.status !== "OK") {
      throw new Error("Error with the provided locations");
    }
    return {
      distance: element.distance.value, // in meters
      duration: element.duration.value, // in seconds
    };
  } catch (error) {
    console.error("Error in getDistanceAndDuration:", error.message);
    throw error;
  }
};

module.exports.getAutoSuggestPlaces = async (input) => {
  try {
    if (!input) {
      throw new Error("Input is required for auto-suggest");
    }
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/autocomplete/json",
      {
        params: {
          input: input,
          key: API_KEY,
        },
      },
    );
    if (response.data.status !== "OK") {
      throw new Error("Error fetching auto-suggest places");
    }
    return response.data.predictions; // array of place predictions
  } catch (error) {
    console.error("Error in getAutoSuggestPlaces:", error.message);
    throw error;
  }
};

module.exports.getCaptainsInTheRadius = async (
  pickupCoords,
  radius,
  vehicleType,
) => {
  // radius in km
  const { lat, lng } = pickupCoords;

  const captains = await captainModel.find({
    location: {
      $geoWithin: {
        $centerSphere: [[lat, lng], radius / 6371],
      },
    },
    vehicleType: vehicleType,
    isAvailable: true,
  });

  return captains;
};
