const Event = require('../models/event.model.js');
const User = require('../models/user.model.js');
const { check } = require('express-validator');


/**
 * This function creates an event
 * 
 * @param {*} req
 * @param {*} res
 * @access Private
 * @returns res.json(event)
 */

exports.create = async function(req, res) {
    try {

    const { title, date, hour, minutes, typeOfCuisine, typeOfMeal, description, menu, allergens, zipCode, address, city, numberMaxOfGuests, cost } = req.body;
    const user = req.user.id;

    if( !title || !date || !hour || !minutes || !typeOfCuisine || !typeOfMeal || !zipCode || !address || !city || !numberMaxOfGuests || !cost) {
        return res.status(400).json({
            msg: "Veuillez renseigner au moins tous les champs suivant : Titre, Date, Heure, Type de Cuisine, Type de Repas, Code Postal, addresse"
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
 * @access Private
 * @returns res.json(events)
 */

exports.listEvents = async function(req, res) {
    try {
        const events = await Event.find()
        .populate({
            path: 'user',
            model: User,
            select: 'firstname avatar'
        })
        .populate({
            path: 'guests.userId',
            model: User,
            select: 'firstname avatar'
        })
        .populate({
            path: 'comments.user',
            model: User,
            select: 'firstname avatar'
        })

        if(!events) {
            res.status(400).json({
                msg: 'Aucun evenement trouve'
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
 * @access Private
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
                return res.status(400).json({ msg: 'Vous etes deja inscrit a cet evenement' });
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
 * @access Private
 * @returns res.json(guests)
 */

exports.removeGuest = async function (req, res) {
    try {
        const user = await User.findById(req.user.id).select('admin');
        const event = await Event.findById(req.params.id);
        const guests = event.guests;
        const removeIndex = guests.map(guest => guest.userId).indexOf(user);

        if(!user) {
            if(guests.filter(guest => guest.userId === req.user.id).length == 0) {
                return res.status(404).json({
                    msg: 'Aucun utilisateur trouve'
                })
            }
        }

        guests.splice(removeIndex, 1);
        await event.save();
        res.json(event);

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
 * @access Private
 * @returns res.json(acceptedGuest[0].status)
 */

exports.acceptGuest = async function (req, res) {
    try {
        const user = await User.findById(req.user.id).select('admin');
        const event = await Event.findById(req.params.event_id);
        guests = event.guests;
        acceptedGuest = guests.filter(guest => guest.userId == req.params.acceptedGuest_id);

        if(!user) {
            if(event.user.toString() !== req.user.id) {
                return res.status(401).json({
                    msg: 'Acces refuse'
                })
            }
        }

        acceptedGuest[0].status = 'Accepte';
        event.save();
        res.json({
            msg: 'Utilisateur accepte'
        });

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
 * @access Private
 * @returns res.json(acceptedGuest[0].status)
 */

exports.refuseGuest = async function (req, res) {
    try {
        const user = await User.findById(req.user.id).select('admin');
        const event = await Event.findById(req.params.event_id);
        guests = event.guests;
        refusedGuest = guests.filter(guest => guest.userId == req.params.refusedGuest_id);

        if(!user) {
            if(event.user.toString() !== req.user.id) {
                return res.status(401).json({
                    msg: 'Acces refuse'
                })
            }
        }

        refusedGuest[0].status = 'Refusé';
        event.save();
        res.json({
            msg: 'Utilisateur refuse'
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
}

/**
 * This function shows an event
 * 
 * @param {*} req
 * @param {*} res
 * @access Private
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
 * @access Private
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
        if(!user) {
            if(event.user.toString() !== req.user.id) {
                return res.status(401).json({
                    msg: 'Acces refuse'
                })
            }
        }

        if(title && event.title != title) event.title = title;
        if(date && event.date != date) event.date = date;
        if(hour && event.hour != hour) event.hour = hour;
        if(minutes && event.minutes != minutes) event.minutes = minutes;
        if(typeOfCuisine && event.typeOfCuisine != typeOfCuisine) event.typeOfCuisine = typeOfCuisine;
        if(typeOfMeal && event.typeOfMeal != typeOfMeal) event.typeOfMeal = typeOfMeal;
        if(description && event.description != description) event.description = description;
        if(menu && event.menu != menu) event.menu = menu;
        if(allergens && event.allergens != allergens) event.allergens = allergens;
        if(zipCode && event.zipCode != zipCode) event.zipCode = zipCode;
        if(address && event.address != address) event.address = address;
        if(city && event.city != city) event.city = city;
        if(numberMaxOfGuests && event.numberMaxOfGuests != numberMaxOfGuests) event.numberMaxOfGuests = numberMaxOfGuests;
        if(cost && event.cost != cost) event.cost = cost;

        await event.save();

        res.json(event);  
     } catch (err) {
         console.error(err.message);
         res.status(500).send('Erreur Serveur');
     }
 }

/**
 * This function validates an event status
 * 
 * @param {*} req
 * @param {*} res
 * @access Admin
 * @returns res.json(event)
 */

exports.validEvent = async function(req, res) {
    try {
        const event = await Event.findById(req.params.id);

        if(!event) {
            return res.status(404).json({
                msg: 'Evenement non trouve'
            })
        }

        event.status = 'Accepte';
        await event.save();

        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
}

/**
 * This function refuses an event status
 * 
 * @param {*} req
 * @param {*} res
 * @access Admin
 * @returns res.json(event)
 */

exports.refuseEvent = async function(req, res) {
    try {
        const event = await Event.findById(req.params.id);

        if(!event) {
            return res.status(404).json({
                msg: 'Evenement non trouve'
            })
        }

        event.status = 'Refuse';
        await event.save();

        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
}

/**
 * This function delete and event by id
 * 
 * @param {*} req
 * @param {*} res
 * @access Private
 * @returns res.json({msg})
 */

exports.DeleteEvent = async function(res, res) {
    try {
        const event = await Event.findById(req.params.id);
        const user = await User.findById(req.user.id).select('admin');
    
        if(!event) {
            return res.status(404).json({
                msg: 'Evenement non trouve'
            })
        }
        
        if(!user) {
            if(event.user.toString() !== req.user.id) {
                return res.status(401).json({
                    msg: 'Acces refuse'
                })
            }
        }

        event.remove();
        res.json({
            msg: 'Event supprime'
        })

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur')
    }
}