require ('dotenv').config();
const mongoose = require('mongoose');
const db = process.env.MONGO_URI || "mongodb+srv://test:test@cluster0-9dtje.mongodb.net/test?retryWrites=true&w=majority";

const connectDb = async() => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });

        console.log('You are now connected to the database');

    } catch (err) {
        console.error(err.message);
        
        //Exit process with failure
        process.exit(1)
    }
};

module.exports = connectDb;