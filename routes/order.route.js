const express = require("express");
const router = express.Router();

const auth = require('../middleware/auth');
const OrderController = require('../controllers/order.controller.js');

router.post('/create', auth, OrderController.createOrder);
router.post('/create', auth, admin, OrderController.adminOrder);

module.export = router;