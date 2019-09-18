const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  title: {
    type: String,
    required: true
  },
  dateOfTheEvent: {
    type: Date,
    required: true
  },
  typeOfMeal: {
    type: String,
    required: true
  },
  descriptionOfTheEvent: {
    type: String
  },
  menu: [
        {
          starter: {
            type: String
          },
          dish: {
            type: String
          },
          dessert: {
            type: String
          },
          drinks: {
            type: String
          },
          other: {
            type: [String]
          }
      }],
  ingredients: {
    type: [String],
  },
  zipCodeOfTheEvent: {
    type: Integer,
    required: true
  },
  addressOfTheEvent: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  numberOfGuests: {
    type: Integer,
    required: true
  },
  numberOfSubscribedGuests: {
    type: Integer,
  }
});
module.exports = Event = mongoose.model('event', EventSchema);
