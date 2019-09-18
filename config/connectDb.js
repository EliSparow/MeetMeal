require ('dotenv').config();
const mongoose = require('mongoose');
const db = process.env.MONGO_URI;

const connectDb = async() => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        });

        console.log('You are now connected to the database');

    } catch (err) {
        console.error(err.message);
        
        //Exit process with failure
        process.exit(1)
    }
};

module.exports = connectDb;