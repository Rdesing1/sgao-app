const express = require('express');
const router = express.Router();
const pool = require('../database.js');
const passport = require('passport');


router.get('/signup', (req, res) => {
    res.render('autch/signup.ejs');
});

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',

}));

router.get('/profile', (req, res) => {
    res.send({
        message: 'welcome'
    })
})
module.exports = router;