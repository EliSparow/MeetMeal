const express = require("express");
const router = express.Router();

const auth = require('../middleware/auth');
const OrderController = require('../controllers/order.controller.js');

//Create an order as current user
router.post('/create', auth, OrderController.createOrder);
//AdminCreate an order for a user
router.post('/adminOrder', auth, admin, OrderController.adminOrder);

module.export = router;