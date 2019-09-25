const express = require("express");
const router = express.Router();

const auth = require('../middleware/auth');
const EventController = require('../controllers/event.controller.js');

router.post('/create', auth, EventController.create);
// router.post('/login', auth, EventController.login);
// router.get('/my-profile', auth, EventController.profile);
router.get('/', auth, EventController.listEvents);
// router.put('/my-profile/:id', auth, EventController.updateProfile);
// router.delete('/:id', auth, EventController.deleteEvent);
module.exports = router;