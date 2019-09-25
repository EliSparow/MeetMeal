const express = require("express");
const router = express.Router();

const auth = require('../middleware/auth');
const EventController = require('../controllers/event.controller.js');

router.post('/create', auth, EventController.create);
router.get('/:id', auth, EventController.showEvent);
router.get('/', auth, EventController.listEvents);
router.put('/:id', auth, EventController.updateEvent);
router.put('/:id/validate', auth, EventController.validEvent);
router.put('/:id/refuse', auth, EventController.refuseEvent);



module.exports = router;