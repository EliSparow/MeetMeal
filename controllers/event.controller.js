const Event = require('../models/event.model.js');
const User = require('../models/user.model.js');
const { check } = require('express-validator');


/**
 * @api {post} /events/create create
 * @apiName create
 * @apiGroup events
 * @apiDescription Cette fonction cree un nouvel evenement
 * 
 * @apiParam {String} id Id de l'utilisateur
 * @apiParam {String} title Titre de l'evenement
 * @apiParam {Date} date Date de l'evenement
 * @apiParam {Number} hour Heure de l'evenement
 * @apiParam {Number} minutes Minutes de l'evenement
 * @apiParam {String} typeOfCuisine Type de l'evenement (dejeuner, brunch, diner...)
 * @apiParam {String} typeOfMeal Type de cuisine (indien, francais, linanais...)
 * @apiParam {Number} zipCode Code postal du lieu de l'evenement
 * @apiParam {String} address Adresse du lieu de l'evenement
 * @apiParam {String} city Ville du lieu de l'evenement
 * @apiParam {String} description Description de l'evenement
 * @apiParam {String} menu Menu propose lors de l'evenement
 * @apiParam {String} allergens Risques d'allergies liees au menu
 * @apiParam {Number} numberMaxOfGuests Nombre maximal d'invite pour l'evenement
 * @apiParam {Number} cost Cout pour chaque invite de l'evenement
 * 
 * @apiSuccess {object} event Evenement cree
 * @apiSuccessExample {json} Success-Response
 *      HTTP/1.1 200 OK
 *      {
 *          "msg" : "Evenement cree"
 *      }
 * 
 * @apiError ChampsObligatoires Un certains nombre de champs sont obligatoires
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
        msg: 'Evenement cree'
    });  
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }

}

/**
 * @api {get} /events listEvents
 * @apiName listEvents
 * @apiGroup events
 * @apiDescription Cette fonction liste l'ensemble des evenements disponibles
 * 
 * @apiSuccess {object} events Evenements trouves
 * 
 * @apiError AucunEvenements Aucun evenement n'est disponible
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
 * @api {put} /events/:id/addGuest addGuest
 * @apiName addGuest
 * @apiGroup events
 * @apiDescription Permet a un utilisateur connecte de s'ajouter a un evenement
 * 
 * @apiParam id Id de l'utilisateur connecte
 * @apiParam id Id de l'evenement concerne
 * 
 * @apiSuccess {object} event Mise a jour de l'evenement
 * 
 * @apiError NombreMaximalAtteint Nombre maximum d'invites deja atteint
 * @apiError UtilisateurDejaInscrit L'utilisateur connecte est deja ajoute a l'evenement
 * @apiError ImpossibleDeRejoindre L'utilisateur ayant cree l'evenement ne peut pas rejoindre son propre evenement comme invite
 * 
 * @apiErrorExample {json} Error-Response
 *      HTTP/1.1 400 KO
 *      {
 *          "msg" : "Nombre maximum d'invites deja atteint"
 *      }
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
 * @api {put} /events/:id/removeGuest removeGuest
 * @apiName removeGuest
 * @apiGroup events
 * @apiDescription Permet a un utilisateur connecte de se retirer d'un evenement
 * 
 * @apiParam id Id de l'utilisateur connecte
 * @apiParam id Id de l'evenement concerne
 * 
 * @apiSuccess {object} event Mise a jour de l'evenement
 * 
 * @apiError AucunUtilisateur Aucun utilisateur ne correspond a l'id passe en parametre
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
 * @api {put} /events/:event_id/validateGuest/:acceptedGuest_id acceptGuest
 * @apiName acceptGuest
 * @apiGroup events
 * @apiDescription Permet a un utilisateur ayant cree un evenement ou un admin d'accepter un utilisateur
 * 
 * @apiParam event_id Id de l'evenement concerne
 * @apiParam acceptedGuest_id Id de l'utilisateur connecte
 * 
 * @apiSuccess {object} event Mise a jour du statut de l'invite sur l'evenement en "Accepte"
 * 
 * @apiSuccessExample {json} Success-Response
 *      HTTP/1.1 200 OK
 *      {
 *          "msg" : "Utilisateur accepte"
 *      }
 * 
 * @apiError AccesRefuse L'utilisateur connecte n'est pas en droit de modifier le statut de l'invite
 * 
 * @apiErrorExample {json} Error-Response
 *      HTTP/1.1 400 KO
 *      {
 *          "msg" : "Acces refuse"
 *      }
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
 * @api {put} /events/:event_id/refuseGuest/:refusedGuest_id refuseGuest
 * @apiName refuseGuest
 * @apiGroup events
 * @apiDescription Permet a un utilisateur ayant cree un evenement ou un admin de refuser un utilisateur
 * 
 * @apiParam event_id Id de l'evenement concerne
 * @apiParam acceptedGuest_id Id de l'utilisateur connecte
 * 
 * @apiSuccess {object} event Mise a jour du statut de l'invite sur l'evenement en "Refuse"
 * 
 * @apiSuccessExample {json} Success-Response
 *      HTTP/1.1 200 OK
 *      {
 *          "msg" : "Utilisateur refuse"
 *      }
 * 
 * @apiError AccesRefuse L'utilisateur connecte n'est pas en droit de modifier le statut de l'invite
 * 
 * @apiErrorExample {json} Error-Response
 *      HTTP/1.1 400 KO
 *      {
 *          "msg" : "Acces refuse"
 *      }
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

        refusedGuest[0].status = 'Refuse';
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
 * @api {get} /events/:id showEvent
 * @apiName showEvent
 * @apiGroup events
 * @apiDescription Cette fonction affiche un evenement en fonction de son id
 *
 * @apiParam id Id de l'evenement concerne
 * 
 * @apiSuccess {object} event Evenements trouves
 * 
 * @apiError AucunEvenement Aucun evenement ne correspond a l'id donne
 * @apiErrorExample {json} Error-Response
 *      HTTP/1.1 400 KO
 *      {
 *          "msg" : "Evenement non trouve"
 *      }
 */

exports.showEvent = async function(req, res) {
    try {
        const event = await Event.findById(req.params.id)
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
        });

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
 * @api {put} /events/:id updateEvent
 * @apiName updateEvent
 * @apiGroup events
 * @apiDescription Cette fonction permet de mettre a jour un evenement si l'utilisateur est le createur de l'evenement ou un administrateur
 * 
 * @apiParam {String} id Id de l'utilisateur connecte
 * @apiParam {string} id Id de l'evenement concerne
 * 
 * @apiParam {String} title Titre mis a jour
 * @apiParam {Date} date Date mise a jour
 * @apiParam {Number} hour Heure mise a jour
 * @apiParam {Number} minutes Minutes mises a jour
 * @apiParam {String} typeOfCuisine Type de l'evenement mis a jour (dejeuner, brunch, diner...)
 * @apiParam {String} typeOfMeal Type de cuisine mise a jour (indien, francais, linanais...)
 * @apiParam {Number} zipCode Code postal mis a jour
 * @apiParam {String} address Adresse mise a jour
 * @apiParam {String} city Ville du lieu mis a jour
 * @apiParam {String} description Description mise a jour
 * @apiParam {String} menu Menu propose mis a jour
 * @apiParam {String} allergens Risques d'allergies liees au menu mis a jour
 * @apiParam {Number} numberMaxOfGuests Nombre maximal d'invite pour l'evenement mis a jour
 * @apiParam {Number} cost Cout pour chaque invite de l'evenement mis a jour
 * 
 * @apiSuccess {object} event Evenement mis a jour
 * 
 * @apiError EvenementIntrouvable Aucun evenement ne correspond a l'id donne
 * @apiError AccesRefuse L'utilisateur connecte n'a pas les droits necessaires pour la mise a jour de l'evenement 
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
        if(hour && event.time.hour != hour) event.time.hour = hour;
        if(minutes && event.time.minutes != minutes) event.time.minutes = minutes;
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
 * @api {put} /events/:id/validate validEvent
 * @apiName validEvent
 * @apiGroup events
 * @apiDescription Cette fonction permet a un administrateur de valider un evenement
 *
 * @apiParam id Id de l'evenement concerne
 * 
 * @apiSuccess {object} event Le statut de l'evenement est change de "En attente" a "Accepte"
 * 
 * @apiError AucunEvenement Aucun evenement ne correspond a l'id donne
 * @apiErrorExample {json} Error-Response
 *      HTTP/1.1 400 KO
 *      {
 *          "msg" : "Evenement non trouve"
 *      }
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
 * @api {put} /events/:id/refuse refuseEvent
 * @apiName refuseEvent
 * @apiGroup events
 * @apiDescription Cette fonction permet a un administrateur de refuser un evenement
 *
 * @apiParam id Id de l'evenement concerne
 * 
 * @apiSuccess {object} event Le statut de l'evenement est change de "En attente" a "Refuse"
 * 
 * @apiError AucunEvenement Aucun evenement ne correspond a l'id donne
 * @apiErrorExample {json} Error-Response
 *      HTTP/1.1 400 KO
 *      {
 *          "msg" : "Evenement non trouve"
 *      }
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
 * @api {post} /events/:id/comment comment
 * @apiName comment
 * @apiGroup events
 * @apiDescription Cette fonction permet a un utilisateur connecte de commenter un evenement
 *
 * @apiParam id Id de l'evenement concerne
 * @apiParam id Id de l'utilisateur connecte
 * @apiParam content Commentaire de l'utilisateur sur l'evenement
 * 
 * @apiSuccess {object} event L'evenement a ete mis a jour avec le commentaire de l'utilisateur
 */

exports.comment = async function (req, res) {
    try {
        const event = await Event.findById(req.params.id);
        const comment = {
            content: req.body.content,
            user: req.user.id,
        };

        event.comments.push(comment);
        await event.save();
        res.json(event.comments);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
}

/**
 * @api {put} /events/:event_id/:comment_id updateComment
 * @apiName updateComment
 * @apiGroup events
 * @apiDescription Cette fonction permet a l'utilisateur qui a commente de mettre a jour son commentaire
 *
 * @apiParam event_id Id de l'evenement concerne
 * @apiParam comment_id Id du commentaire concerne
 * @apiParam id Id de l'utilisateur ayant laisse un commentaire
 * @apiParam content Commentaire mis a jour de l'utilisateur sur l'evenement
 * 
 * @apiSuccess {object} event Le commentaire de l'evenement a ete mis a jour
 * 
 * @apiError CommentaireIntrouvable Le commentaire dont l'id a ete passe en parametre n'existe pas
 * @apiError AccesRefuse L'utilisateur connecte n'a pas les droits de modification
 * 
 * @apiErrorExample {json} Error-Response
 *      HTTP/1.1 404 KO
 *      {
 *          "msg" : "Ce commentaire n'existe pas"
 *      }
 */

exports.updateComment = async function (req, res) {
    try {
        const user = req.user.id;
        const event = await Event.findById(req.params.event_id);
        const comment = event.comments.find(comment => comment.id === req.params.comment_id);
        const { content } = req.body;

        if (!comment)
            return res.status(404).send("Ce commentaire n'existe pas");

        if (comment.user.toString() === user || user.admin) {
            if(content) comment.content = content;
            await event.save();
            res.json(event.comments);
        } else {
            return res.status(401).send("Vous n'avez pas les droits pour cet action");
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
}

/**
 * @api {delete} /events/:event_id/:comment_id deleteComment
 * @apiName deleteComment
 * @apiGroup events
 * @apiDescription Cette fonction permet a l'utilisateur qui a commente de supprimer son commentaire
 *
 * @apiParam event_id Id de l'evenement concerne
 * @apiParam comment_id Id du commentaire concerne
 * @apiParam id Id de l'utilisateur ayant laisse un commentaire
 * 
 * @apiSuccess {object} event Le commentaire de l'evenement a ete supprime
 * 
 * @apiError CommentaireIntrouvable Le commentaire dont l'id a ete passe en parametre n'existe pas
 * @apiError AccesRefuse L'utilisateur connecte n'a pas les droits de modification
 * 
 * @apiErrorExample {json} Error-Response
 *      HTTP/1.1 404 KO
 *      {
 *          "msg" : "Ce commentaire n'existe pas"
 *      }
 */

exports.deleteComment = async function (req, res) {
    try {
        const event = await Event.findById(req.params.event_id);
        const comment = event.comments.find(comment => comment.id === req.params.comment_id);
        const user = req.user.id;

        if (!comment)
            return res.status(404).send("Ce commentaire n'existe pas");

        if (comment.user.toString() !== user)
            return res.status(401).send("Vous n'avez pas les droits pour cet action");

        const removeIndex = event.comments.map(comment => comment.user.toString()).indexOf(req.user.id);

        event.comments.splice(removeIndex, 1);
        await event.save();
        res.json(event.comments);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
}

/**
 * @api {delete} /events/:id deleteEvent
 * @apiName deleteEvent
 * @apiGroup events
 * @apiDescription Cette fonction permet a l'utilisateur ayant cree l'evenement ou a un administrateur de supprimer un evenement
 *
 * @apiParam id Id de l'evenement concerne
 * @apiParam id Id de l'utilisateur connecte
 * 
 * @apiSuccess {object} event L'evenement a ete supprime
 * 
 * @apiSuccessExample {json} Success-Response
 *      HTTP/1.1 200 OK
 *      {
 *          "msg" : "Evenement supprime"
 *      }
 * 
 * @apiError EvenementIntrouvable L'evenement dont l'id a ete passe en parametre n'existe pas
 * @apiError AccesRefuse L'utilisateur connecte n'a pas les droits de modification
 * 
 * @apiErrorExample {json} Error-Response
 *      HTTP/1.1 404 KO
 *      {
 *          "msg" : "Evenement non trouve"
 *      }
 */

exports.deleteEvent = async function(res, res) {
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

        await event.remove();
        res.json({
            msg: 'Evenement supprime'
        })

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur')
    }
};

/**
 * @api {get} /events/:id/showEvents showCreatedEvents
 * @apiName showCreatedEvents
 * @apiGroup events
 * @apiDescription Cette fonction permet d'afficher les evenements que l'utilisateur dont l'id a ete passe en parametre a cree
 *
 * @apiParam id Id de l'utilisateur
 * 
 * @apiSuccess {object} events Les evenements cree par l'utilisateur sont affiches
 * 
 * @apiError EvenementIntrouvable Aucun evenement n'a ete trouve
 * @apiError UtilisateurIntrouvable L'utilisateur n'a pas ete trouve
 * 
 * @apiErrorExample {json} Error-Response
 *      HTTP/1.1 404 KO
 *      {
 *          "msg" : "Evenements non trouves"
 *      }
 */

exports.showCreatedEvents = async function (req, res) {
    try {
        const events = await Event.find({ user: req.params.id })
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
        });

        if (events.length == 0) {
            return res.status(404).json({
                msg: "Evenements non trouves"
            });
        };
        

        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur')  
    }
}

/**
 * @api {get} /events/:id/guestsEvents showGuestsEvents
 * @apiName showGuestsEvents
 * @apiGroup events
 * @apiDescription Cette fonction permet d'afficher les evenements que l'utilisateur dont l'id a ete passe en parametre a rejoint
 *
 * @apiParam id Id de l'utilisateur
 * 
 * @apiSuccess {object} events Les evenements que l'utilisateur a rejoint sont affiches
 * 
 * @apiError EvenementIntrouvable Aucun evenement n'a ete trouve
 * @apiError UtilisateurIntrouvable L'utilisateur n'a pas ete trouve
 * 
 * @apiErrorExample {json} Error-Response
 *      HTTP/1.1 404 KO
 *      {
 *          "msg" : "Evenements non trouves"
 *      }
 */

exports.showGuestsEvents = async function (req, res) {
    try {
        const events = await Event.find({ 'guest.userId': req.params.id })
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
        });

        if (events.length == 0) {
            return res.status(404).json({
                msg: "Evenements non trouves"
            });
        };

        res.json(events);        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur')
    }
};