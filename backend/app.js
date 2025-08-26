const dotenv = require('dotenv');
dotenv.config();

// Middlewares
const express = require("express");
const cors = require('cors');


const app = express();

// For dev only
app.use(cors());


// Routes
app.get('/', (req, res) => {
    res.send("Hey boi");
});


module.exports = app;