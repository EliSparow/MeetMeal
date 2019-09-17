//package requirement
require ('dotenv').config();
const express = require("express");
const bodyParser = require ("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

//files requirement
const connectDb = require('./config/connectDb');

//port requirement 
const port = process.env.PORT;

connectDb();

mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var allowedOrigins = ['http://localhost:8080'];
app.use(cors({
    origin: function(origin, callback) {
        if (!origin)
            return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not allow acces from specified origin.';
            return(callback(new Error(msg), false));
        }

        return(callback(null, true));
    }
}));

app.use(express.json({extended: false}));
app.listen(port, () => console.log(`server run on port ${port}`));