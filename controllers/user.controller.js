const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');
const { check } = require('express-validator');
const jwt = require('jsonwebtoken');

/**
 * @api {post} /users/register register
 * @apiName register
 * @apiGroup users
 * @apiDescription Cette fonction enregistre un utilisateur si tous les champs sont entres
 * 
 * @apiParam {String} firstname Prenom de l'utilisateur
 * @apiParam {String} lastname Nom de l'utilisateur
 * @apiParam {Number} age Age de l'utilisateur
 * @apiParam {String} email Email de l'utilisateur
 * @apiParam {String} password Mot de passe de l'utilisateur
 * 
 * @apiSuccess {object} user Profil utilisateur cree
 * @apiSuccessExample {json} Success-Response
 *      HTTP/1.1 200 OK
 *      {
 *          "msg" : "Utilisateur enregistre"
 *      }
 * 
 * @apiError ChampsObligatoires Tous les champs sont obligatoires
 * @apiError AgeInvalide L'age entre n'est pas un nombre
 * @apiError AgeMinimum L'utilisateur doit avoir 18 ans ou plus pour s'enregistrer
 * @apiError EmailInvalide L'email entre n'est pas conforme
 * @apiError PasswordInvalide Le mot de passe doit avoir entre 6 et 20 caracteres
 * @apiError UtilisateurDejaEnregistre L'utilisateur existe deja
 */

exports.register = async function(req, res) {
    try {

        let { firstname, lastname, age, email, password, admin } = req.body;
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
        const avatar = 'https://profilepicturesdp.com/wp-content/uploads/2018/06/avatar-for-profile-picture-2.png';

        user = new User({
            firstname,
            lastname,
            age,
            email,
            password,
            avatar,
            admin
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
 * @api {post} /users/login login
 * @apiName login
 * @apiGroup users
 * @apiDescription Cette fonction permet a un utilisateur de se connecter
 * 
 * @apiParam {String} email Email de l'utilisateur
 * @apiParam {String} password Mot de passe de l'utilisateur
 * 
 * @apiSuccess {String} token Token de la session defini
 * @apiSuccess {String} id Id de l'utilisateur
 * 
 * @apiError EmailNecessaire Le champs email est vide
 * @apiError PasswordNecessaire Le champs mot de passe est vide
 * @apiError UtilisateurInconnu L'email entre n'est pas reconnu
 * @apiError PasswordInvalide Le mot de passe lie a l'email entre n'est pas valide
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
        if(user.isDesactivated) {
            user.isDesactivated = false;
            await user.save();
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
                res.status(200).json({ token, user });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
}

/**
 * @api {get} /users/my-profile myProfile
 * @apiName myProfile
 * @apiGroup users
 * @apiDescription Permet d'afficher le profil de l'utilisateur connecte
 * 
 * @apiParam {String} id Id de l'utilisateur
 * 
 * @apiSuccess {object} user Profil de l'utilisateur
 * @apiSuccess {String} user.firstname Prenom de l'utilisateur
 * @apiSuccess {String} user.lastname Nom de l'utilisateur
 * @apiSuccess {String} user.avatar Avatar de l'utilisateur
 * @apiSuccess {String} user.loveStatus Situation amoureuse de l'utilisateur
 * @apiSuccess {Number} user.zipCode Code postal de l'utilisateur
 * @apiSuccess {String} user.city Ville de l'utilisateur
 * @apiSuccess {String} user.bio Description de l'utilisateur
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
 * @api {get} /users/profile/:id profile
 * @apiName profile
 * @apiGroup users
 * @apiDescription Permet d'afficher le profil d'un utilisateur dont l'id est passe en parametre
 * 
 * @apiParam {String} id Id de l'utilisateur dont on souhaite afficher le profil
 * 
 * @apiSuccess {object} user Profil de l'utilisateur
 * @apiSuccess {String} user.avatar Avatar de l'utilisateur
 * @apiSuccess {String} user.firstname Prenom de l'utilisateur
 * @apiSuccess {String} user.lastname Nom de l'utilisateur
 * @apiSuccess {Number} user.age Age de l'utilisateur
 * @apiSuccess {String} user.bio Description de l'utilisateur
 * @apiSuccess {String} user.loveStatus Situation amoureuse de l'utilisateur
 * @apiSuccess {String} user.address Adresse de l'utilisateur
 * @apiSuccess {Number} user.zipCode Code postal de l'utilisateur
 * @apiSuccess {String} user.city Ville de l'utilisateur
 * @apiSuccess {Number} user.toquesAvailable Nombre de toques disponibles de l'utilisateur
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
 * @api {get} /users/:id updateProfile
 * @apiName updateProfile
 * @apiGroup users
 * @apiDescription Permet de mettre a jour son propre profil
 * 
 * @apiParam {String} id Id de l'utilisateur dont on souhaite modifier le profil
 * 
 * @apiSuccess {object} user Profil de l'utilisateur mis a jour
 * @apiSuccess {String} user.firstname Prenom de l'utilisateur
 * @apiSuccess {String} user.lastname Nom de l'utilisateur
 * @apiSuccess {Number} user.age Age de l'utilisateur
 * @apiSuccess {String} user.email Email de l'utilisateur
 * @apiSuccess {String} user.password Mot de passe de l'utilisateur
 * @apiSuccess {String} user.avatar Avatar de l'utilisateur
 * @apiSuccess {String} user.bio Description de l'utilisateur
 * @apiSuccess {String} user.loveStatus Situation amoureuse de l'utilisateur
 * @apiSuccess {String} user.address Adresse de l'utilisateur
 * @apiSuccess {Number} user.zipCode Code postal de l'utilisateur
 * @apiSuccess {String} user.city Ville de l'utilisateur
 * @apiSuccess {Number} user.toquesAvailable Nombre de toques disponibles de l'utilisateur
 * 
 * @apiError EmailDejaUtilise L'email entre est deja utilise
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
        toquesAvailable,
        isDesactivated
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
    if(isDesactivated) userProfile.isDesactivated = isDesactivated;

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
 * @api {put} /users/ listUsers
 * @apiName listUsers
 * @apiGroup users
 * @apiDescription Affichage des profils des utilisateurs inscrits
 * 
 * @apiSuccess {object} users Liste des utilisateurs inscrits
 */

exports.listUsers = async function(req, res) {
    try {
        const users = await User.find().select('-password').where('isDesactivated').equals(false);
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
}

/**
 * @api {delete} /users/:id deleteUser
 * @apiName deleteUser
 * @apiGroup users
 * @apiDescription Suppression de l'utilisateur connecte
 * 
 * @apiParam {String} id Id de l'utilisateur a supprimer
 * 
 * @apiSuccessExample {json} Success-Response
 *      HTTP/1.1 200 OK
 *      {
 *          "msg" : "Utilisateur supprime"
 *      }
 *
 * @apiError UtilisateurNonTrouve L'utilisateur dont l'id est passe en parametre n'a pas ete trouve
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