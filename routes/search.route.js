const express = require ("express");
const router = express.Router();

const auth = require ('../middleware/auth');
const SearchController = require ('../controllers/search.controller.js');

router.post('/users/', auth, SearchController.user);
router.post('/event/', auth, SearchController.event);

module.exports = router;