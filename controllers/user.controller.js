const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');
const { check } = require('express-validator');

/**
 * This function registered an user if every credentials are valide
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */

async function register(req, res) {
    const { firstname, lastname, age, email, password } = req.body;

    if (!firstname || !lastname || !age || !email || !password) {
        return res.status(400).json({
            msg: "Tous les champs sont obligatoires."
        });
    };

    if (typeOf(age) !== 'number') {
        return res.status(400).json({
            msg: 'Veuillez entrer un age valide'
        })
    };

    if (age < 18) {
        return res.status(400).json({
            msg: "Vous devez avoir 18 ans ou plus pour vous inscrire au site"
        })
    };

    check('email', 'Votre email est invalide').isEmail();
    check('password', 'Le mot de passe doit avoir entre 6 et 20 caracteres').isLength({ min: 6, max: 20 });

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                msg: "L'utilisateur existe deja."
            })
        };

        user = new User({
            firstname,
            lastname,
            age,
            email,
            password 
        });

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();
    } catch (err) {
        console.log
    }
}

exports.register = register;