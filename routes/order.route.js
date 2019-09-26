const express = require("express");
const router = express.Router();

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const OrderController = require('../controllers/order.controller.js');

//Create an order as current user
router.post('/create', auth, OrderController.createOrder);
//AdminCreate an order for a user
router.post('/adminOrder', auth, admin, OrderController.adminOrder);
//Read order
router.get('/:id', auth, OrderController.showOrder);
//User's order by userId
router.get('/userorder/:user_id', auth, OrderController.userOrders);
//User cancell order
router.delete('/:id', auth, admin, OrderController.deleteOrder);
//List orders
router.get('/listorder', auth, admin, OrderController.listOrders);

module.exports = router;