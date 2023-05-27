const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const helpers = require('../lib/helpers.js');
const pool = require("../database.js");
const bcryptjs = require("bcryptjs");


passport.use('local.signup',new LocalStrategy({
    usernameField:'userName',
    passwordField:'password',
    passReqToCallback:true

},async (req,userName,password,done) =>{
    const {email,fullName,typeUser} = req.body
    const dataUser ={
        typeUser:typeUser,
        email:email,
        name:userName,
        passwords:password,
        fullName:fullName
    }
    dataUser.passwords = await helpers.encrypPassword(password);
    try{
        const result = await pool.query("INSERT INTO users SET ?",[dataUser]);
        dataUser.id = result.insertId;
        return done(null,dataUser);
    }catch(e){
        console.log("Ha ocurrido un problema",e);
    }

}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, rows[0]);
});