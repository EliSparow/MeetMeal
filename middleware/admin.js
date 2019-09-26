const User = require('../models/user.model.js');

/**
 * Module to check if the user is an admin or not
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

module.exports = async function(req, res, next) {
    let user = await User.findById(req.user.id);
    if(user.admin) {
        next();
    } else {
        res.status(401).send("Acces non autorise");
    }
}