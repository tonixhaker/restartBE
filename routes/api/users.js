const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../../config/auth');
const Users = mongoose.model('Users');

router.post('/register', auth.optional, async(req, res, next) => {
    try {
        const {body: {user}} = req;

        const finalUser = new Users(user);

        finalUser.setPassword(user.password);

        await finalUser.save();
        res.json({user: finalUser.toAuthJSON()});

    } catch (e) {
        res.status(500).send(e);
    }
});

router.post('/login', auth.optional, (req, res, next) => {
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
            return status(400).info;
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