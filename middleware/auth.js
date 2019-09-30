const jwt = require('jsonwebtoken');

/**
 * This module exports the token set
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */

module.exports = async function(req, res, next) {

    // Get token from header
    const token = req.header('x-auth-token');

    // Check if there is no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verified token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded.user;
        let user = await User.findById(req.user.id);
        if (user.isDesactivated == false ){
            next()
        }
        else{
            return res.status(401).json({ user })
        }
        } catch (err) {
        res.status(401).json({ msg: 'Bad token' });
    }
}