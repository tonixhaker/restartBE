const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../../config/auth');
const Users = mongoose.model('Users');

router.post('/register', auth.optional, (req, res, next) => {
    const { body: { user } } = req;

    const finalUser = new Users(user);

    finalUser.setPassword(user.password);

    return finalUser.save()
        .then(() => res.json({ user: finalUser.toAuthJSON() }));
});

router.post('/login', auth.optional, (req, res, next) => {
    const { body: { user } } = req;

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
});

router.get('/current', auth.required, (req, res, next) => {
    const { payload: { id } } = req;

    return Users.findById(id)
        .then((user) => {
            if(!user) {
                return res.sendStatus(400);
            }

            return res.json({ user: user.toAuthJSON() });
        });
});

module.exports = router;