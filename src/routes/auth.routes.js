const express = require('express');
const router = express.Router();
const pool = require('../database.js');
const passport = require('passport');

router.get('/signin',(req,res) =>{
    res.render('autch/signin.ejs');
});
 

router.post('/signin',(req,res,next)=>{
    passport.authenticate('local.signin',{
        successRedirect:'/profile',
        failureRedirect:'/signin'
    })(req,res,next);
})


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
});


module.exports = router;