const User = require('../models/user.model');
const Event = require('../models/event.model');


/**
 * @api {post} /search/users user
 * @apiName user
 * @apiGroup search
 * @apiDescription Cette fonction permet d'afficher les utilisateurs recherches
 *
 * @apiParam search Mot(s)-cle(s) entres par l'utilisateur pour rechercher un autre utilisateur enregistre
 * 
 * @apiSuccess {object} result Affichage des utilisateurs enregistres correspondant a la recherche de l'utilisateur
 * 
 * @apiError ChampVide Entrer obligatoirement un mot-cle pour effectuer une recherche
 * @apiError UtilisateurIntrouvable L'utilisateur n'a pas ete trouve
 */

exports.user = async function(req, res) {
    const { search }  = req.body;

    if(!search) {
        return res.status(400).json({
            msg: "Entrez un mot-cle"
        });
    }

    try {
        let result = await User.find({
            $and: [
                { $or: [
                    {
                        firstname: { $regex: search, $options: "i" }
                    },
                    {
                        lastname: { $regex: search, $options: "i" }
                    }
                ]},
                { isDesactivated: false }
            ]
        });

        if(result == "") {
            return res.status(404).json({
                msg: "Utilisateur non trouve"
            });
        }
        res.status(200).json({result})
    } catch(err){
        res.status(500).json({
            msg: "Erreur Serveur"
        });
    }
}

/**
 * @api {post} /search/event event
 * @apiName event
 * @apiGroup search
 * @apiDescription Cette fonction permet d'afficher les evenements recherches
 *
 * @apiParam {String[]} result Tableau contenant les mots-cles de l'utilisateur recherchant un ou des evenement(s)
 * 
 * @apiSuccess {object} result Affichage des evenements crees correspondant a la recherche de l'utilisateur
 * 
 * @apiError ChampVide Entrer obligatoirement un mot-cle pour effectuer une recherche
 * @apiError EvenementIntrouvable L'evenement n'a pas ete trouve
 */

exports.event = async function(req, res) {
    const { city, zipCode, date, typeOfMeal, typeOfCuisine } =req.body;

    const search = [];

    if(zipCode != "") search.push({ zipCode: zipCode })
    if(city != "") search.push({ city: { $regex: city, $options: "i" } })
    if(date != "") search.push({ date: date })
    if(typeOfMeal != "") search.push({ typeOfMeal: { $regex: typeOfMeal, $options: "i" } })
    if(typeOfCuisine != "") search.push({ typeOfCuisine: { $regex: typeOfCuisine, $options: "i" } })

    if(!search) {
        return res.status(400).json({
            msg: "Entrez un mot-cle"
        });
    }

    try {
      if (search == "") {
        var result = await Event.find()
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
        console.log(result);
      }
      else {
        var result = await Event.find({$and: search})
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
      }

        if(result == "") {
            return res.status(404).json({
                msg: "Evenement non trouve"
            });
        }
        res.status(200).json({ result })
    } catch(err){
        console.log(err);
        res.status(500).json({
            msg: "Erreur Serveur"
        });
    }
}
