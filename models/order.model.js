const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'user',
        required : true
    },
    numberToques: {
        type: Number,
        required : true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = Event = mongoose.model('order', orderSchema);