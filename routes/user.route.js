const UserController = require('../controllers/user.controller.js');

module.exports = function(app) {
    app.post('/register', UserController.register);
    app.post('/login', UserController.login);
}