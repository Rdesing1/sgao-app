const express = require('express');
const router = express.Router();
const pool = require('../database.js');
const {isLoggedIn} = require('../lib/autch.js');

// get employess
router.get('/employees',isLoggedIn,async(req,res)=>{
    res.send("prueba de employees ok!");
});

// save employees 
router.get('/employees/add',(req,res) =>{
    res.render('employess/add.ejs');
});




module.exports = router;