const express = require("express");
const router = express.Router();

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const EventController = require('../controllers/event.controller.js');

router.post('/create', auth, EventController.create);
router.get('/:id', auth, EventController.showEvent);
router.get('/', auth, EventController.listEvents);
router.put('/:id', auth, EventController.updateEvent);
router.put('/:id/validate', auth, admin, EventController.validEvent);
router.put('/:id/refuse', auth, admin, EventController.refuseEvent);

module.exports = router;