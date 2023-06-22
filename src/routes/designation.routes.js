const express = require('express');
const router = express.Router();
const pool = require('../database.js');
const {isLoggedIn} = require('../lib/autch.js');
const { dataDB } = require('../keys.js');

// get designation
router.get('/designations',async (req,res) =>{
    try{
        let designations = [];
        let result = await pool.query('SELECT estate,description,circuit.id,circuit.name as circuit,users.fullName as evaluador FROM designation INNER JOIN circuit ON circuit.id=designation.idCircuit2 INNER JOIN assignemployee ON circuit.id=assignemployee.idCircuit INNER JOIN users_assignemployee ON assignemployee.id=users_assignemployee.idAssignemployee1 INNER JOIN users ON users_assignemployee.idUser7=users.id');
        designations = result;
        if(designations.length > 0){
            res.status(200).json({data:designations});
        }else{
            res.status(200).json({data:'Aun no se han creado las designaciones!'});
        }
    }catch(err){

    }
});

router.get('/designation/employees',async(req,res) =>{
    try{
        let designation = [];
        let result = await pool.query('');
    }catch(err){
        
    }
});


// add designation view
router.get('/designation/add',async(req,res) =>{
    let id = req.user.id;
    try {
        let circuit = [];
        let result = await pool.query("SELECT users.id, users.fullName, typeuser.role,assignemployee.idCircuit as id, assignemployee.nameCircuit as name, assignemployee.dates,assignemployee.entrance,assignemployee.exits FROM users_assignemployee INNER JOIN users ON users_assignemployee.idUser7=users.id INNER JOIN typeuser ON users.typeUser=typeuser.id INNER JOIN assignemployee ON users_assignemployee.idAssignemployee1=assignemployee.id WHERE users.id = ?",[id]);
        circuit = result;
        if(circuit.length > 0){
            res.render('designation/add.ejs',{
                data:circuit
            });
        }else{
            let data = 0
            res.render('designation/add',{
                data:data
            });
        }
    }catch(err){
        res.status(404).json({message:'Ha ocurrido un problema', err});
    }
 
});

router.post('/designation/add', async(req,res) =>{
    let {state,description,idCircuit2} = req.body;
    let dataDesignation = {
        estate:state,
        description:description,
        idCircuit2:idCircuit2
    } 
    try{
        let result = await pool.query('INSERT INTO designation SET ?',[dataDesignation]);
        if(result.affectedRows === 1){
            res.json({message:`desingnacion creada. nuemro: ${result.insertId}`});
        }else{
            res.json({message:'Designacion no creada.'});
        }
        
    }catch(err){
        res.status(404).json({err});
    }

});


router.get('/designation',(req,res) =>{
    res.send('hola');
});



module.exports = router;