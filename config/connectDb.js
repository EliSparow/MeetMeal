require ('dotenv').config();
const mongoose = require('mongoose');
const db = process.env.MONGO_URI || "mongodb+srv://test:test@cluster0-9dtje.mongodb.net/test?retryWrites=true&w=majority";

const connectDb = async() => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        });
        if(db == 'mongodb+srv://test:test@cluster0-9dtje.mongodb.net/test?retryWrites=true&w=majority'){
            console.log('You are now connected to the TEST database');
        }else {
            console.log('You are now connected to the MAIN database');
        }
        

    } catch (err) {
        console.error(err.message);
        
        //Exit process with failure
        process.exit(1)
    }
};

module.exports = connectDb;