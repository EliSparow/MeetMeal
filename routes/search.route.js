const express = require ("express");
const router = express.Router();

const auth = require ('../middleware/auth');
const SearchController = require ('../controllers/search.controller.js');

//Search User
router.post('/users/', auth, SearchController.user);
//Search Event
router.post('/event/', SearchController.event);

module.exports = router;