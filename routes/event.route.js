const express = require("express");
const router = express.Router();

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const EventController = require('../controllers/event.controller.js');

// Create event
router.post('/create', auth, EventController.create);
// Show event by ID
router.get('/:id', auth, EventController.showEvent);
// Show all events
router.get('/', auth, EventController.listEvents);
// Update event
router.put('/:id', auth, EventController.updateEvent);

// Delete event
router.delete('/:id', auth, EventController.deleteEvent);
// Validate event
router.put('/:id/validate', auth, admin, EventController.validEvent);
// Refuse event
router.put('/:id/refuse', auth, admin, EventController.refuseEvent);

// Add guest
router.put('/:id/addGuest', auth, EventController.addGuest);
// Remove guest
router.put('/:id/removeGuest', auth, EventController.removeGuest);
// Accept guest
router.put('/:event_id/validateGuest/:acceptedGuest_id', auth, EventController.acceptGuest);
// Refuse guest
router.put('/:event_id/refuseGuest/:refusedGuest_id', auth, EventController.refuseGuest);

// Add comment
router.post('/:id/comment', auth, EventController.comment);
// Update comment
router.put('/:event_id/:comment_id', auth, EventController.updateComment);
// Delete comment
router.delete('/:event_id/:comment_id', auth, EventController.deleteComment);

// Show created events by an user
router.get('/:id/showEvents', EventController.showCreatedEvents);
// Show the user's guests events
router.get('/:id/guestsEvents', EventController.showGuestsEvents);

module.exports = router;