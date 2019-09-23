// const jwt = require('jsonwebtoken');

const User = require('../models/user.model');

/**
  * @param {*} req
  * @param {*} res
  * @param {*} next
  * @returns
  */

module.exports = async function(req, res, next) {
    try{
        let userAdmin = await User.findById(req.user.id).select('admin');
        
        if(userAdmin !== true){
            res.status(401).json({ msg: 'Permission denied' })
        }
        next();

    } catch(err) {
        res.status(500).json({ msg: 'Server Error' })
    }
}