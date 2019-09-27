const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');
const { check } = require('express-validator');
const jwt = require('jsonwebtoken');

/**
 * This function registered an user if every credentials are valide
 *
 * @param {*} req
 * @param {*} res
 * @returns
 * @access Public
 */

exports.register = async function(req, res) {
    try {

        let { firstname, lastname, age, email, password } = req.body;

        if (!firstname || !lastname || !age || !email || !password) {
            return res.status(400).json({
                msg: "Tous les champs sont obligatoires"
            });
        };

        check('age', 'Veuillez entrer un age valide').isInt();

        if (age < 18) {
            return res.status(400).json({
                msg: "Vous devez avoir 18 ans ou plus pour vous inscrire au site"
            })
        };

        check('email', 'Votre email est invalide').isEmail();
        check('password', 'Le mot de passe doit avoir entre 6 et 20 caracteres').isLength({ min: 6, max: 20 });

        let user = await User.findOne({ email });
        lastname = lastname.toUpperCase();

        if (user) {
            return res.status(400).json({
                msg: "L'utilisateur existe deja"
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

        res.status(200).json({
            msg: 'Utilisateur enregistre'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
}

/**
 * This functions logged an user if every credentials are valide
 *
 * @param {*} req
 * @param {*} res
 * @returns
 * @access Public
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
            process.env.JWT_SECRET, { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.status(200).json({token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
}

/**
 * Get profile of the user connected
 *
 * @param {*} req
 * @param {*} res
 * @returns json(user)
 * @access Private
 */

exports.myProfile = async function(req, res) {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
}

/**
 * Get profile by ID
 * 
 * @param {*} req
 * @param {*} res
 * @returns json(user)
 * @access Private
 */

 exports.profile = async function(req, res) {
     try {
         const user = await User.findById(req.params.id).select('-password');
         res.json(user);
     } catch (err) {
         console.error(err.message);
         res.status(500).send('Erreur serveur');
     }
 }

 /**
  * Update profile
  * 
  * @param {*} req
  * @param {*} res
  * @returns json(user)
  * @access Private
  */

exports.updateProfile = async function(req, res) {
    const {
        firstname,
        lastname,
        age,
        email,
        password,
        avatar,
        bio,
        loveStatus,
        zipCode,
        address,
        city,
        toquesAvailable
    } = req.body;

    const userProfile = {};

    userProfile.user = req.user.id;

    if(firstname) userProfile.firstname = firstname;
    if(lastname) userProfile.lastname = lastname;
    if(age) userProfile.age = age;
    if(email) userProfile.email = email;
    if(password) {
        const salt = await bcrypt.genSalt(10);
        newPassword = await bcrypt.hash(password, salt);
        userProfile.password = newPassword;
    };
    if(avatar) userProfile.avatar = avatar;
    if(bio) userProfile.bio = bio;
    if(loveStatus) userProfile.loveStatus = loveStatus;
    if(zipCode) userProfile.zipCode = zipCode;
    if(address) userProfile.address = address;
    if(city) userProfile.city = city;
    if(toquesAvailable) userProfile.toquesAvailable = toquesAvailable;

    try {
        let user = await User.findOne({ _id: req.params.id });

        if (user) {
            if(user.email === userProfile.email) {
                return res.status(400).json({
                    msg: "Email deja utilise"
                });
            }

            user = await User.findOneAndUpdate({ _id: req.params.id }, { $set: userProfile });
            user = await User.findOne({ _id: req.params.id });
            res.json(user);
        }
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Erreur serveur')
    }
}

/**
 * Get a list of the users
 *
 * @param {*} req
 * @param {*} res
 * @access Private
 */

exports.listUsers = async function(req, res) {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
}

/**
  * Delete user by ID
  * 
  * @param {*} req
  * @param {*} res
  * 
  * @desc Delete user by ID
  * @access Private
 */

exports.deleteUser = async function(req, res) {
    try {
        const user = await User.findById(req.params.id);

        // Check if user exists:
        if(!user){
            return res.status(404).json({ msg: 'Utilisateur non trouve' });
        }

        await user.remove();
        res.status(200).json({ msg: 'Utilisateur supprime' });

    } catch(err){
        console.error(err);
        res.status(500).send('Erreur Serveur');
    }
}