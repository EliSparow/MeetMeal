const User = require('../models/user.model');
const Event = require('../models/event.model');


/**
  * This function search an user
  * 
  * @param {*} req
  * @param {*} res
  * @returns
 */

exports.user = async function(req, res) {
    const { searchUser } = req.body;
    
    if(!searchUser) {
        return res.status(400).json({
            msg: "Entrez un mot-cle."
        });
    }

    try {
        let result = await User.find({
            $or: [
                {
                    firstname: { $regex: searchUser }
                }, 
                {
                    lastname: { $regex: searchUser.toUpperCase() }
                }
            ] , 
        });

        if(result == "") {
            return res.status(404).json({
                msg: "Utilisateur non trouve"
            });
        }
        res.status(200).json({ result })
    } catch(err){
        res.status(500).json({
            msg: "Erreur Serveur"
        });
    }
}

/**
 *  This function search an user
 * 
 * @param {*} req
 * @param {*} res
 * @returns 
 */

exports.event = async function(req, res) {
    const { searchEvent } =req.body;
    
    if(!searchEvent) {
        return res.status(400).json({
            msg: "Entrez un mot-cle."
        });
    }

    try {
        let result = await Event.find({
            $or: [
                {
                    title: { $regex: searchEvent }
                },
                {
                    typeOfCuisine: { $regex: searchEvent }
                },
                {
                    typeOfTheEvent: { $regex: searchEvent }
                },
                {
                    ingredients: { $regex: searchEvent }
                },
                {
                    city: { $regex: searchEvent }
                }
            ] ,
        });

        if(result == "") {
            return res.status(404).json({
                msg: "Evenement non trouve"
            });
        }
        res.status(200).json({ result })
    } catch(err){
        res.status(500).json({
            msg: "Erreur Serveur"
        });
    }
}