const express = require("express");
const router = express.Router();

const isAdmin = require('../middleware/admin');
const auth = require('../middleware/auth');
const UserController = require('../controllers/user.controller.js');

//Register
router.post('/register', UserController.register);
//Login
router.post('/login', UserController.login);
//Current user profile
router.get('/my-profile', auth, UserController.myProfile);
//profile by ID
router.get('/:id', auth, UserController.profile);
//List users
router.get('/', auth, UserController.listUsers);
//Update users by ID
router.put('/:id', auth, UserController.updateProfile);
//Delete User
router.delete('/:id', auth, UserController.deleteUser);

module.exports = router;