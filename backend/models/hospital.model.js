const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  capacity: {
    type: Number,
    default: 0, // optional: for tracking availability
  },
});

module.exports = mongoose.model("hospital", hospitalSchema);
