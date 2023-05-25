const express = require('express');
const router = express.Router();
const pool = require('../database.js');

router.get('/charges', async (req,res) =>{
    const dataCharges = await pool.query("SELECT * FROM charges");
    console.log(dataCharges);
    res.render('charges/index.ejs',{
        dataCharges
    });
});

router.get('/charges/add',(req,res) =>{
    res.render('charges/add.ejs');
});


router.post('/charges/add', async (req,res) =>{
    const {name,description} = req.body;
    const dataCharge ={
        name:name,
        responsability:description
    }
    console.log(dataCharge);
    await pool.query("INSERT INTO charges SET ?",[dataCharge]);
    res.send('cgarge successfull');
});


module.exports = router;