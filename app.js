//package requirement
require ('dotenv').config();
const express = require("express");
const bodyParser = require ("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();



//files requirement
const connectDb = require('./config/connectDb');
const user = require("./routes/user.route");
const event = require("./routes/event.route")

const search = require("./routes/search.route");

const search = require("./routes/search.route");

//port requirement 
const port = process.env.PORT;

connectDb();

mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var allowedOrigins = ['http://localhost:3000', 'https://meetmeal.netlify.com'];
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

// Test Heroku
app.get('/test', (req,res) => {
    res.send("<h1>This is Working</h1>")
})

app.use("/users", user);
app.use("/events", event);

app.use("/search", search);

app.use("/search", search);

app.use(express.json({extended: false}));
app.listen(port, () => console.log(`server run on port ${port}`));

module.exports = app;