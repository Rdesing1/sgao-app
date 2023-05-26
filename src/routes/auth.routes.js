const express = require('express');
const router = express.Router();
const pool = require('../database.js');

router.get('/singup',(req,res) =>{
    res.render('autch/signup.ejs');
});

module.exports = router;