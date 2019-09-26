const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'user',
        required : true
    },
    numberToc: {
        type: Number,
        required : true
    },
    createdAd: {
        type: Date,
        default: Date.now
    }
})

module.exports = Event = mongoose.model('order', orderSchema);