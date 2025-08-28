const router = require("express").Router();
const { authUser } = require("../middlewares/auth.middleware");
const mapsController = require("../controllers/maps.controller");

// Get coordinates from address
router.get("/get-coordinates", authUser, mapsController.getCoordinates);

// Get address from coordinates
router.get("/get-address", authUser, mapsController.getAddress);

// Get distance and duration between two points
router.get(
  "/get-distance-duration",
  authUser,
  mapsController.getDistanceAndDuration,
);

// Get auto suggestions for places
router.get("/place-suggestions", authUser, mapsController.getPlaceSuggestions);

module.exports = router;
