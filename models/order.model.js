const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'user',
        required : true
    },
    numberOfToques: {
        type: Number,
        required : true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = Event = mongoose.model('order', orderSchema);