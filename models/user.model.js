const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    avatar: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    bio: {
      type: String
    },
    loveStatus: {
      type: String
    },
    zipCode: {
      type: Integer
    },
    address: {
      type: String
    },
    city: {
      type: String
    },
    toquesAvailable: {
      type: Integer
    },
    admin: {
        type: Boolean,
        default: false
    }
});

module.exports = User = mongoose.model('user', UserSchema);
