const dotenv = require('dotenv');
dotenv.config();

// Middlewares
const express = require("express");
const cors = require('cors');
const connectDB = require('./db/db');
const cookieParser = require('cookie-parser');

// Connect to DB
connectDB();


const app = express();

// For dev only
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(cookieParser());


// Routes
app.get('/', (req, res) => {
    res.send("Hey boi");
});


module.exports = app;