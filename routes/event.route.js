const express = require("express");
const router = express.Router();

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const EventController = require('../controllers/event.controller.js');

//create event
router.post('/create', auth, EventController.create);
//show event by ID
router.get('/:id', auth, EventController.showEvent);
//show event
router.get('/', auth, EventController.listEvents);
//update event
router.put('/:id', auth, EventController.updateEvent);

//delete event
router.delete('/:id', auth, EventController.DeleteEvent);
//validate event
router.put('/:id/validate', auth, admin, EventController.validEvent);
//refuse event
router.put('/:id/refuse', auth, admin, EventController.refuseEvent);

//add guest
router.put('/:id/addGuest', auth, EventController.addGuest);
//remove guest
router.put('/:id/removeGuest', auth, EventController.removeGuest);
//accept guest
router.put('/:event_id/validateGuest/:acceptedGuest_id', auth, EventController.acceptGuest);
//refuse guest
router.put('/:event_id/refuseGuest/:refusedGuest_id', auth, EventController.refuseGuest);

router.post('/:id/comment', auth, EventController.comment);
router.put('/:event_id/:comment_id', auth, EventController.updateComment);
router.delete('/:event_id/:comment_id', auth, EventController.deleteComment);

module.exports = router;