const Order = require('../models/order.model');
const User = require('../models/user.model');

/**
 * Create order
 * @param {*} req
 * @param {*} res
 * @access Private
 * @returns res.json(order)
 */

exports.createOrder = async function(req, res) {
    try {

        const { numberOfToques } = req.body;
        const userId = req.user.id;
        const user = User.findById(userId).select('-password')

        if ( !numberOfToques ) {
            return res.status(400).json({
                msg: "Veuillez renseigner tout les champs."
            })
        }

        let order = new Order ({
            userId,
            numberOfToques,
            createdAt
        });

        await order.save();
        user.toquesAvailable += numberOfToques;
        await user.save();

        res.status(200).json(
            [{
            msg: 'Commande passée.'
            },
            user])

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Erreur serveur');
        }
}

exports.adminOrder = async function(req, res) {
    try {
        const { numberOfToques, userId } = req.body;
        const user = User.findById(userId);

        if ( !numberOfToques || !userId) {
            return res.status(400).json({
                msg: "Veuillez renseigner tous les champs."
            })
        }

        let order = new Order ({
            user,
            numberOfToques,
            createdAt
        });

        await order.save();
        user.toquesAvailable += numberOfToques;
        await user.save();

        res.status(200).json([
            {
               msg: 'Commande effectuée.'
            },
            user
        ])
    } catch (err) {
        console.err(err.message);
        res.status(500).send('Erreur serveur');
    }
}