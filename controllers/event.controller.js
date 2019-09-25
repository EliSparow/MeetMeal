const Event = require('../models/event.model.js');
const User = require('../models/user.model.js');
const { check } = require('express-validator');


/**
 * This function creates an event
 * 
 * @param {*} req
 * @param {*} res
 * @returns res.json(event)
 */

exports.create = async function(req, res) {
    try {

    const { title, date, hour, minutes, typeOfCuisine, typeOfMeal, description, menu, allergens, zipCode, address, city, numberMaxOfGuests, cost } = req.body;
    const user = req.user.id;

    if( !title || !date || !hour || !minutes || !typeOfCuisine || !typeOfMeal || !zipCode || !address || !city || !numberMaxOfGuests || !cost) {
        return res.status(400).json({
            msg: "Veuillez renseignez au moins tous les champs suivant : Titre, Date, Heure, Type de Cuisine, Type de Repas, Code Postal, addresse"
        })
    }

    let event = new Event ({
        user,
        title,
        date,
        time: {
            hour,
            minutes
        },
        typeOfCuisine,
        typeOfMeal,
        description,
        menu,
        allergens,
        zipCode,
        address,
        city,
        numberMaxOfGuests,
        cost
    });

    await event.save()

    res.status(200).json({
        msg: 'Event cree'
    });  
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }

}

/**
 * This function lists all events
 * 
 * @param {*} req
 * @param {*} res
 * @returns res.json(events)
 */

exports.listEvents = async function(req, res) {
    try {
        const events = await Event.find()

        if(!events) {
            res.status(400).json({
                msg: 'Aucun evenement trouve'
            })
        }
        
        res.json(events);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Erreur Server');
    }
}

/**
 * This function shows an event
 * 
 * @param {*} req
 * @param {*} res
 * @returns res.json(event)
 */

exports.showEvent = async function(req, res) {
    try {
        const event = await Event.findById(req.params.id);

        if(!event) {
            return res.status(404).json({
                msg: 'Evenement non trouve'
            })
        }

        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
}

/**
 * This function updates an event
 * 
 * @param {*} req
 * @param {*} res
 * @returns res.json(event)
 */

 exports.updateEvent = async function(req, res) {
     try {
        let event = await Event.findById(req.params.id);
        const user = await User.findById(req.user.id).select('admin');
        const { title, date, hour, minutes, typeOfCuisine, typeOfMeal, description, menu, allergens, zipCode, address, city, numberMaxOfGuests, cost } = req.body;

        if(!event) {
            return res.status(404).json({
                msg: 'Evenement non trouve'
            })
        }

        // Check on user
        if(event.user.toString() !== req.user.id || !user) {
            return res.status(401).json({
                msg: 'Acces refuse'
            })
        } 

        if(title) event.title = title;
        if(date) event.date = date;
        if(hour) event.hour = hour;
        if(minutes) event.minute = minute;
        if(typeOfCuisine) event.typeOfCuisine = typeOfCuisine;
        if(typeOfMeal) event.typeOfMeal = typeOfMeal;
        if(description) event.description = description;
        if(menu) event.menu = menu;
        if(allergens) event.allergens = allergens;
        if(zipCode) event.zipCode = zipCode;
        if(address) event.address = address;
        if(city) event.city = city;
        if(numberMaxOfGuests) event.numberMaxOfGuests = numberMaxOfGuests;
        if(cost) event.cost = cost;

        await event.save();

        res.json(event);  
     } catch (err) {
         console.error(err.message);
         res.status(500).send('Erreur Serveur');
     }
 }