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
        const user = await User.findById(userId).select('-password')

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

/**
 * admin order
 * @param {*} req
 * @param {*} res
 * @access admin
 * @returns res.json(order)
 */

exports.adminOrder = async function(req, res) {
    try {
        const { numberOfToques, userId } = req.body;
        const user = await User.findById(userId);

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

/**
 * See order
 * @param {*} req
 * @param {*} res
 * @access Private
 * @returns res.json(order)
 */

exports.showOrder = async function (req, res) {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                msg: 'Commande introuvable.'
            })
        }

        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
}

/**
 * See user's orders
 * @param {*} req
 * @param {*} res
 * @access Private
 * @returns res.json(order)
 */

exports.userOrders = async function (req, res) {
    try {
        const orders = await Order.find({userId: req.params.user_id});

        if (!orders) {
            return res.status(404).json({
                msg: 'Aucune commande trouvee.'
            })
        }

        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
}

/**
 * Delete order
 * @param {*} req
 * @param {*} res
 * @access Admin
 * @returns res.json(order)
 */

exports.deleteOrder = async function(res, req) {
    try {
        const order = await Order.findById(req.params.id);
        const user = await User.findById(order.userId);

        if(!order) {
            return res.status(404).json({
                msg: 'Aucune commande trouvee'
            })
        }

        user.toquesAvailable -= order.numberOfToques;
        await user.save();
        await order.remove();

        res.json([
            {
                msg: 'Commande annulee'
            },
            user
        ])

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur')
    }
}

/**
 * List order
 * @param {*} req
 * @param {*} res
 * @access Admin
 * @returns res.json(order)
 */

exports.listOrders = async function (req, res) {
    try {
        const orders = await Order.find();

        if (!orders) {
            return res.status(404).json({
                msg: 'Aucune commande trouvee.'
            })
        }

        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
}