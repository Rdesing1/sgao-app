const express = require('express');
const router = express.Router();
const pool = require('../database.js');
const {isLoggedIn} = require('../lib/autch.js');

// get circuits
router.get('/circuit', async (req,res)=>{
    try {
        let circuits = await pool.query("SELECT * FROM circuit");
        res.json({circuits});
    } catch (err) {
        res.json({message:"Ha ocurrido un problema. ",err});
    }
});

// get circuit for id
router.get('/circuit/:id',async (req,res) =>{
    let id = req.params.id;
    try {
        let circuit = await pool.query("SELECT * FROM circuit WHERE id = ?",[id]);
        if(circuit.length > 0){
            res.json({circuit:circuit[0]});
        }else{
            res.json({message:"El circuito solicitado no existe."});
        }
    } catch (err) {
        res.json({message:"Ha ocurrido un problema. ",err});
    }
});

// create circuits
router.post('/circuit/add',async (req,res) =>{
    let {name,location} = req.body;
    let dataCircuit = {
        name:name,
        location:location
    }
    try {
        let result = await pool.query("INSERT INTO circuit SET ?",[dataCircuit]);
        if(result.affectedRows === 1){
            res.send(` registro insertado ${result.insertId}`);
        }else{
            res.send('problema al registrar el circuito');
        }
    } catch (err) {
        res.json({message:'ha ocurrido un error. ', err});
    }
});


// update circuit
router.post('/circuit/update/:id',async (req,res) =>{
    let id = req.params.id;
    let {name,location} = req.body;
    const dataCircuit = {
        name:name,
        location:location
    }
    
    try {
        let result = await pool.query("UPDATE circuit SET ? WHERE id=?",[dataCircuit,id]);
        if(result.affectedRows === 1){
            res.json({result});
        }else{
            res.json({message:'id no encontrado'});
        }
    } catch (err) {
        res.json({message:'ha ocurrido un error. ', err});
    }

});


// delete circuit;
router.get('/circuit/delete/:id',async (req,res) =>{
    let id = req.params.id;
    try{
        let result = await pool.query("DELETE FROM circuit WHERE id=?",[id]);
        if(result.affectedRows === 1){
            res.json({message: "registro eliminado"});
        }else{
            res.json({message: "id no encontrado"});
        }
    }catch(err){
        res.json({message:'ha ocurrido un error. ', err});

    }
});

module.exports = router;