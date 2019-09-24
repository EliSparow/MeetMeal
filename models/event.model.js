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
  timeOfTheEvent: {
      hour: {
        type: Number,
        min: 0,
        max: 23,
        required: true
      },
      minute: {
        type: Number,
        min: 0,
        max: 59,
        required: true
      }
  },
  typeOfCuisine: {
    type: String,
    enum: ['Américaine', 'Argentine', 'Bresilienne', 'Chinoise', 'Espagnole', 'Française', 'Grecque', 'Indienne', 'Italienne', 'Japonaise', 'Libanaise', 'Marocaine', 'Mexicaine', 'Thaïlandaise', 'Péruvien', 'Vegan', 'Végétarienne', 'Vietnamienne', 'Autre'],
    required: true
  },
  typeOfMeal: {
    type: String,
    enum: ['Petit-Déjeuner', 'Brunch', 'Déjeuner', 'Dîner', 'Apéro', 'Pique-Nique'],
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
    type: Number,
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
    type: Number,
    required: true
  },
  numberOfSubscribedGuests: {
    type: Number,
  }
});
module.exports = Event = mongoose.model('event', EventSchema);
