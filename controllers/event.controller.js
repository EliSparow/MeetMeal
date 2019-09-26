const Event = require('../models/event.model.js');
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
            msg: "Veuillez renseignez au moins tous les champs suivant : "
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

    res.status(200).json(event);  
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }

}

/**
 * This function list all events
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
                msg: 'Aucun événement trouvé'
            })
        }
        
        res.json(events);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
}

/**
 * This function add a guest to an event
 *
 * @param {*} req
 * @param {*} res
 * @returns res.json(guests)
 */

exports.addGuest = async function (req, res) {
    try {
        const user = req.user.id;
        const event = await Event.findById(req.params.id);        
        const guests = event.guests;

        if (guests.length < event.numberMaxOfGuests) {
            if (guests.filter(guest => guest.userId === user).length == 0) {
                if (user != event.user) {
                    guests.push({ userId: user });        
                    await event.save();
                    res.json(guests);
                } else {
                    return res.status(400).json({ msg: 'Vous ne pouvez pas rejoindre votre propre evenement' });
                }
            } else {
                return res.status(400).json({ msg: 'Vous etes deja enregistre a cet evenement' });
            }
        } else {
            return res.status(400).json({ msg: "Nombre maximum d'invites deja atteint" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    };
}

/**
 * This function remove a guest from an event
 *
 * @param {*} req
 * @param {*} res
 * @returns res.json(guests)
 */

exports.removeGuest = async function (req, res) {
    try {
        const user = req.user.id;
        const event = await Event.findById(req.params.id);
        const guests = event.guests;
        const removeIndex = guests.map(guest => guest.userId).indexOf(user);

        if (user.admin || guests.filter(guest => guest.userId === user)) {
            guests.splice(removeIndex, 1);
            await event.save();
            res.json(guests);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
}

/**
 * This function change the status of a guest to "Accepté"
 *
 * @param {*} req
 * @param {*} res
 * @returns res.json(acceptedGuest[0].status)
 */

exports.acceptGuest = async function (req, res) {
    try {
        const user = req.user.id;
        const event = await Event.findById(req.params.event_id);
        guests = event.guests;
        acceptedGuest = guests.filter(guest => guest.userId == req.params.acceptedGuest_id);

        if (user === event.user || user.admin) {
            acceptedGuest[0].status = 'Accepté';
            event.save();
            res.json(acceptedGuest[0].status);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
}

/**
 * This function change the status of a guest to "Refusé"
 *
 * @param {*} req
 * @param {*} res
 * @returns res.json(acceptedGuest[0].status)
 */

exports.refuseGuest = async function (req, res) {
    try {
        const user = req.user.id;
        const event = await Event.findById(req.params.event_id);
        guests = event.guests;
        refusedGuest = guests.filter(guest => guest.userId == req.params.refusedGuest_id);

        if (user === event.user || user.admin) {
            refusedGuest[0].status = 'Refusé';
            event.save();
            res.json(refusedGuest[0].status);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
}