const captainModel = require('../models/captain.model');

module.exports.createCaptain = async ({
    firstname, lastname, email, password, color, plate, capacity, vehicleType
}) => {
    // 1️⃣ Validation
    if (!firstname || !email || !password || !color || !plate || !capacity || !vehicleType) {
        throw new Error('All fields are required');
    }
    // 2️⃣ Check if captain already exists
    const existingCaptain = await captainModel.findOne({ email });
    if (existingCaptain) {
        throw new Error('Captain already exists');
    }
    // 3️⃣ Create captain (pre-save hook will hash password)
    const captain = await captainModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password,
        vehicle: {
            color,
            plate,
            capacity,
            vehicleType
        }
    })

    return captain;
}

// Create and send token to cookie
module.exports.sendToken = (res, captain) => {
  // 1️⃣ Generate JWT
  const token = captain.generateJWT();

  // 2️⃣ Set token in cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 3600000 // 1 hour
  });

  return token;
};