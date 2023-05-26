const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

passport.use('local.signup',new LocalStrategy({
    usernameField:'userName',
    passwordField:'password',
    passReqToCallback:true
},async (req,userName,password,done) =>{
    console.log({userName,password});
}));

