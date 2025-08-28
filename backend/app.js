const dotenv = require("dotenv");
dotenv.config();

// Middlewares
const express = require("express");
const cors = require("cors");
const connectDB = require("./db/db");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user.routes");
const captainRoutes = require("./routes/captain.routes");
const mapsRoutes = require("./routes/maps.routes");
const rideRoutes = require("./routes/ride.routes");

// Connect to DB
connectDB();

const app = express();

// For dev only
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
  res.send("Hey boi");
});

app.use("/api/user", userRoutes);
app.use("/api/captain", captainRoutes);
app.use("/api/maps", mapsRoutes);
app.use("/api/rides", rideRoutes);

module.exports = app;
