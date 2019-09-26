const express = require("express");
const router = express.Router();

const isAdmin = require('../middleware/admin');
const auth = require('../middleware/auth');
const UserController = require('../controllers/user.controller.js');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/my-profile', auth, UserController.myProfile);
router.get('/:id', auth, UserController.profile);
router.get('/', auth, UserController.listUsers);
router.put('/:id', auth, UserController.updateProfile);
router.delete('/:id', auth, UserController.deleteUser);

module.exports = router;