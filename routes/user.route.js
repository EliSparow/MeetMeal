const express = require("express");
const router = express.Router();

const auth = require('../middleware/auth');
const UserController = require('../controllers/user.controller.js');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/my-profile', auth, UserController.profile);
router.get('/', auth, UserController.listUsers);
// router.put('/my-profile/:id', auth, UserController.updateProfile);

module.exports = router;