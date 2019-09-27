const User = require('../models/user.model');
const Event = require('../models/event.model');


/**
  * This function search an user
  * 
  * @param {*} req
  * @param {*} res
  * @returns res.json({ result })
  * @access Private
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
            $or: [
                {
                    firstname: { $regex: search, $options: "i" }
                }, 
                {
                    lastname: { $regex: search, $options: "i" }
                }
            ] , 
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
 *  This function search an event
 * 
 * @param {*} req
 * @param {*} res
 * @returns res.json({ result })
 * @access Public
 */

exports.event = async function(req, res) {
    const { city, zipCode, date, typeOfMeal, typeOfCuisine } =req.body;

    const search = [];

    if(zipCode) search.push({ zipCode: zipCode })
    if(city) search.push({ city: { $regex: city, $options: "i" } })
    if(date) search.push({ date: date })
    if(typeOfMeal) search.push({ typeOfMeal: { $regex: typeOfMeal, $options: "i" } })
    if(typeOfCuisine) search.push({ typeOfCuisine: { $regex: typeOfCuisine, $options: "i" } })

    console.log(search);

    if(!search) {
        return res.status(400).json({
            msg: "Entrez un mot-cle"
        });
    }

    try {
        let result = await Event.find({$and: search})
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