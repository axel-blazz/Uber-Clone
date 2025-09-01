const User = require("../models/user.model"); // similarly for captain.model.js
const Captain = require("../models/captain.model");

module.exports.saveDeviceToken = async (req, res) => {
  const { token, role } = req.body;
  const userId = req.user._id;

  try {
    if (role === "captain") {
        await Captain.findByIdAndUpdate(userId, { deviceToken: token });
    } else {
    await User.findByIdAndUpdate(userId, { deviceToken: token });
    }
    res.status(200).json({ message: "Token saved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
