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

exports.register = async function(req, res) {
    const { firstname, lastname, age, email, password } = req.body;

    if (!firstname || !lastname || !age || !email || !password) {
        return res.status(400).json({
            msg: "Tous les champs sont obligatoires."
        });
    };

    if (typeof(age) !== 'number') {
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

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

        return res.status(200).send( user );
    } catch (err) {
        console.log(err);
        res.status(500).send('Erreurs serveur');
    }
}

/**
 * This functions logged an user if every credentials are valide
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */

exports.login = async function(req, res) {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({
            msg: 'Email necessaire'
        });
    }

    if (!password) {
        return res.status(400).json({
            msg: 'Mot de passe necessaire'
        });
    }

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                msg: 'Utilisateur inconnu'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                msg: 'Mot de passe invalide'
            });
        }

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtSecret'), { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.log(err);
        res.status(500).send('Erreurs serveur');
    }
}