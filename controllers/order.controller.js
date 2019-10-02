const Order = require('../models/order.model');
const User = require('../models/user.model');

/**
 * @api {post} /orders/create create
 * @apiName create
 * @apiGroup orders
 * @apiDescription Cette fonction permet d'ajouter des "toques" au compte de l'utilisateur connecte
 *
 * @apiParam id Id de l'utilisateur
 * @apiParam numberOfToques Le nombre de "toques" de l'utilisateur connecte
 * 
 * @apiSuccess {object} order Creation d'un objet order
 * @apiSuccess {object} user Mise a jour du profil de l'utilisateur connecte
 * @apiSuccess {Number} user.toquesAvailable Mise a jour du nombre de "toques" de l'utilisateur
 * 
 * @apiSuccessExample {json} Success-Response
 *      HTTP/1.1 200 OK
 *      [{
 *          "msg" : "Commande passee"
 *      },
 *          user
 *      ]
 * 
 * @apiError ChampsNonRenseignes Tous les champs sont a renseigner
 */

exports.createOrder = async function(req, res) {
    try {

        const { numberOfToques } = req.body;
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password')

        if ( !numberOfToques ) {
            return res.status(400).json({
                msg: "Veuillez renseigner tout les champs"
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
            msg: 'Commande passee'
            },
            user])

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Erreur serveur');
        }
}

/**
 * @api {post} /orders/adminOrder adminOrder
 * @apiName adminOrder
 * @apiGroup orders
 * @apiDescription Cette fonction permet a un administrateur d'ajouter des "toques" au compte d'un utilisateur
 *
 * @apiParam id Id de l'utilisateur auquel les "toques" doivent etre ajoutes
 * @apiParam numberOfToques Le nombre de "toques" de l'utilisateur auquel les "toques" doivent etre ajoutes
 * 
 * @apiSuccess {object} order Creation d'un objet order
 * @apiSuccess {object} user Mise a jour du profil de l'utilisateur dont l'id a ete passe en parametre
 * @apiSuccess {Number} user.toquesAvailable Mise a jour du nombre de "toques" de l'utilisateur
 * 
 * @apiSuccessExample {json} Success-Response
 *      HTTP/1.1 200 OK
 *      [{
 *          "msg" : "Commande effectuee"
 *      },
 *          user
 *      ]
 * 
 * @apiError ChampsNonRenseignes Tous les champs sont a renseigner
 */

exports.adminOrder = async function(req, res) {
    try {
        const { numberOfToques, userId } = req.body;
        const user = await User.findById(userId);

        if ( !numberOfToques || !userId) {
            return res.status(400).json({
                msg: "Veuillez renseigner tous les champs"
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
               msg: 'Commande effectuee'
            },
            user
        ])
    } catch (err) {
        console.err(err.message);
        res.status(500).send('Erreur serveur');
    }
}

/**
 * @api {get} /orders/:id showOrder
 * @apiName showOrder
 * @apiGroup orders
 * @apiDescription Cette fonction permet de visualiser une commande de "toques"
 *
 * @apiParam id Id d'une commande de "toques"
 * 
 * @apiSuccess {object} order Affichage d'une commande passee
 * 
 * @apiError CommandeIntrouvable La commande dont l'id a ete renseigne est introuvable
 */

exports.showOrder = async function (req, res) {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                msg: 'Commande introuvable'
            })
        }

        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
}

/**
 * @api {get} /orders/userorder/:user_id userOrders
 * @apiName userOrders
 * @apiGroup orders
 * @apiDescription Cette fonction permet de visualiser les commandes de "toques" d'un utilisateur donne
 *
 * @apiParam id Id d'un utilisateur
 * 
 * @apiSuccess {object} orders Affichage des commandes passees par un utilisateur
 * 
 * @apiError CommandeIntrouvable Aucune commande trouvee pour l'utilisateur dont l'id a ete passe en parametre
 */

exports.userOrders = async function (req, res) {
    try {
        const orders = await Order.find({userId: req.params.user_id});

        if (!orders) {
            return res.status(404).json({
                msg: 'Aucune commande trouvee'
            })
        }

        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
}

/**
 * @api {delete} /orders/:id deleteOrder
 * @apiName deleteOrder
 * @apiGroup orders
 * @apiDescription Cette fonction permet a un utilisateur d'annuler une commande passee
 *
 * @apiParam id Id d'un utilisateur
 * @apiParam id Id de la commande que l'utilisateur a passe
 * 
 * @apiSuccess {object} user Mise a jour du profil de l'utilisateur
 * @apiSuccess {Number} user.toquesAvailable Mise a jour du nombre de "toques" de l'utilisateur selectionne
 * @apiSuccess {object} order Suppression de la commande de "toques" de l'utilisateur
 * 
 * @apiSuccessExample {json} Success-Response
 *      HTTP/1.1 200 OK
 *      [{
 *          "msg" : "Commande annulee"
 *      },
 *          user
 *      ]
 * 
 * @apiError CommandeIntrouvable Aucune commande trouvee pour l'utilisateur dont l'id a ete passe en parametre
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
 * @api {get} /orders/listOrders listOrders
 * @apiName listOrders
 * @apiGroup orders
 * @apiDescription Cette fonction permet de visualiser l'ensemble des commandes de "toques" effectuees sur le site
 * 
 * @apiSuccess {object} orders Affichage de l'ensemble des commandes
 * 
 * @apiError CommandeIntrouvable Aucune commande n'a ete trouve
 */

exports.listOrders = async function (req, res) {
    try {
        const orders = await Order.find();

        if (!orders) {
            return res.status(404).json({
                msg: 'Aucune commande trouvee'
            })
        }

        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
}