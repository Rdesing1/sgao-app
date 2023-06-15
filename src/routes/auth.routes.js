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

router.get('/profile', isLoggedIn, async (req, res) => {
    try{
        let dataUser = [];
        let users = await pool.query('SELECT users.id as id,typeUser.role as Tipo ,users.email as email ,users.name as Nombre,users.fullName as fullName FROM users INNER JOIN typeUser ON users.typeUser=typeUser.id ORDER BY Tipo');
        dataUser = users;
        if(dataUser.length > 0){
            res.render('admin/index.ejs',{
                data:dataUser
            });
        }
    }catch(err){
        res.status(404).json({message:err});
    }
//    res.render('admin/index.ejs',{

//    });
});

router.get('/users/search/:id',async (req,res) =>{
    let id = req.params.id;
    let result = [];
    try{
        let user = await pool.query('SELECT * FROM users WHERE id=?',[id]);
        result = user;
        if(result.length > 0){
            res.render('admin/user.ejs',{
                data:result
            });
        }
    }catch(err){
        res.status(404).json({message:'user not found.'});
    }
});

router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/signin');
    });
});


module.exports = router;