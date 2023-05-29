const express = require('express');
const router = express.Router();
const pool = require('../database.js');
const passport = require('passport');
const {isLoggedIn,isNotLoggedIn} = require('../lib/autch.js');

router.get('/signin',isNotLoggedIn,(req,res) =>{
    res.render('autch/signin.ejs');
});
 

router.post('/signin',isNotLoggedIn,(req,res,next)=>{
    passport.authenticate('local.signin',{
        successRedirect:'/profile',
        failureRedirect:'/signin'
    })(req,res,next);
})


router.get('/signup',isNotLoggedIn,(req, res) => {
    res.render('autch/signup.ejs');
});

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',

}));

router.get('/profile', isLoggedIn,  (req, res) => {
   res.render('admin/index.ejs');
});


router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/signin');
    });
});


module.exports = router;