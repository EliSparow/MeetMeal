const express = require("express");
const router = express.Router();

const auth = require('../middleware/auth');
const EventController = require('../controllers/event.controller.js');

router.post('/create', auth, EventController.create);
router.get('/', auth, EventController.listEvents);
router.put('/:id/addGuest', auth, EventController.addGuest);
router.put('/:id/removeGuest', auth, EventController.removeGuest);
router.put('/:event_id/acceptGuest/:acceptedGuest_id', auth, EventController.acceptGuest);
router.put('/:event_id/refuseGuest/:refusedGuest_id', auth, EventController.refuseGuest);

module.exports = router;