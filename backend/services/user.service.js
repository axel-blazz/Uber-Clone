const UserModel = require('../models/user.model');

module.exports.createUser = async ({ firstname, lastname, email, password }) => {
  // 1️⃣ Validation
  if (!firstname || !lastname || !email || !password) {
    throw new Error('All fields are required');
  }

  // 2️⃣ Check if user already exists
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // 3️⃣ Create user (pre-save hook will hash password)
  const user = await UserModel.create({
    fullname: { firstname, lastname },
    email,
    password
  });


  return user;
};


// Create and send token to cookie
module.exports.sendToken = (res, user) => {
  // 1️⃣ Generate JWT
  const token = user.generateJWT();

  // 2️⃣ Set token in cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 3600000 // 1 hour
  });

  return token;
};