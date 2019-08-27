const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../../config/auth');
const Users = mongoose.model('Users');
const Joi = require('@hapi/joi');
const validator = require('express-joi-validation').createValidator();

const registerSchema = Joi.object({user:{
        email: Joi.string().email({minDomainSegments: 2}).required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required()
    }
});
router.post('/register', [auth.optional,validator.body(registerSchema)], async(req, res, next) => {
    try {
        const {body: {user}} = req;
        const existUser = await Users.findOne({email:user.email});

        if (existUser) {
            return res.status(409).send('User already exist');
        }

        const finalUser = new Users(user);

        finalUser.setPassword(user.password);

        await finalUser.save();
        return res.json({user: finalUser.toAuthJSON()});

    } catch (e) {
        return res.status(500).send(e);
    }
});

const loginSchema = Joi.object({user:{
        email: Joi.string().email({minDomainSegments: 2}).required(),
        password: Joi.string().required()
    }
});
router.post('/login', [auth.optional,validator.body(loginSchema)], (req, res, next) => {
    try {

        return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
            if(err) {
                return next(err);
            }

            if(passportUser) {
                const user = passportUser;
                user.token = passportUser.generateJWT();

                return res.json({ user: user.toAuthJSON() });
            }
            return res.status(400).send('Wrong credentials');
        })(req, res, next);

    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/current', auth.required, (req, res, next) => {
    try {
        const { payload: { id } } = req;

        return Users.findById(id)
            .then((user) => {
                if(!user) {
                    return res.sendStatus(400);
                }

                return res.json({ user: user.toAuthJSON() });
            });
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;