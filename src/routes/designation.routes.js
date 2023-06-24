const express = require('express');
const router = express.Router();
const pool = require('../database.js');
const {isLoggedIn} = require('../lib/autch.js');
const { dataDB } = require('../keys.js');
const e = require('connect-flash');

// get designation
router.get('/designations',async (req,res) =>{
    try{
        let designations = [];
        let result = await pool.query('SELECT designation.id as id,designation.estate,designation.description,circuit.name as circuit,users.fullName as evaluador FROM designation INNER JOIN circuit ON circuit.id=designation.idCircuit2 INNER JOIN assignemployee ON circuit.id=assignemployee.idCircuit INNER JOIN users_assignemployee ON assignemployee.id=users_assignemployee.idAssignemployee1 INNER JOIN users ON users_assignemployee.idUser7=users.id GROUP BY id');
        designations = result;
        if(designations.length > 0){
            res.render('designation/index.ejs',{
                data:designations
            });
        }else{
            res.render('designations/index.ejs',{
                data:'No se han encontrado nuevas evaluaciones'
            });
        }
    }catch(err){

    }
});

router.get('/designation/employees',async(req,res) =>{
    let designations = {
        id:req.user.id
    } 
    try{
        let designation = [];
        let result = await pool.query('SELECT designation.id ,designation.estate,designation.description,circuit.name as circuit,users.id as iduser,users.fullName as evaluador FROM designation INNER JOIN circuit ON circuit.id=designation.idCircuit2 INNER JOIN assignemployee ON circuit.id=assignemployee.idCircuit INNER JOIN users_assignemployee ON assignemployee.id=users_assignemployee.idAssignemployee1 INNER JOIN users ON users_assignemployee.idUser7=users.id WHERE users.id=? GROUP BY designation.id',[designations.id]);
        designation = result;
        // res.status(200).json({data:designation});
        if(designation.length > 0){
            res.render('designation/indexEmployeesdesignation.ejs',{
                data:designation
            });
        }
    }catch(err){
        res.json({err})
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

// search designations;

router.get('/designations/search/:id',async (req,res) =>{
    let designation = {
        id:req.params.id
    } 
    try {
        let designations = [];
        let result = await pool.query('SELECT designation.id ,designation.estate,designation.description,circuit.name as circuit,users.fullName as evaluador FROM designation INNER JOIN circuit ON circuit.id=designation.idCircuit2 INNER JOIN assignemployee ON circuit.id=assignemployee.idCircuit INNER JOIN users_assignemployee ON assignemployee.id=users_assignemployee.idAssignemployee1 INNER JOIN users ON users_assignemployee.idUser7=users.id WHERE designation.id = ? GROUP BY designation.id',[designation.id]);
        designations = result;
        if(designations.length > 0){
            res.render('designation/get.ejs',{
                data:designations[0]
            });
        }

    } catch (err) {
        res.status(404).json({err});
    }
    
});

// update designation of employees
router.get('/designation/employees/update/:id',async (req,res)=>{
    let id = req.params.id;
    try{    
        let designation = [];
        let result = await pool.query('SELECT * FROM designation WHERE id=?',[id]);
        designation = result;
        if(designation.length > 0){
            res.render('designation/update.ejs',{
                data:designation[0]
            });

        }else{
            res.json({data:"id not found!"});
        }
    }catch(err){
        res.status(404).json({message:`Ha ocurrido un problema ${err}`});
    }
});

// update designation of employees post 
router.post('/designation/employees/update/:id', async (req,res)=>{
    let id = req.params.id;
    let {estate,description} = req.body;
    let designationData = {
        estate:estate,
        description:description
    } 
    try{
        let result = await pool.query('UPDATE designation SET ? WHERE id= ?',[designationData,id]);
        if(result.affectedRows === 1){
            res.json({Message:'Registro actualizado!'});
        }
    }catch(err){
        res.json({Message:err});
    }
});

// verificate designations
router.get('/designations/verificate/:id', async(req,res)=>{
    let designation = {
        id:req.params.id
    } 
    try {
        let result = await pool.query('update FROM designation WHERE id= ?',[designation.id]);
        if(result.affectedRows === 1){
            res.redirect('/designations');
        }else{
            res.json({data:'designation not found!'});
        }
    } catch (err) {
        res.status(404).json({message:err});
    }
});


router.get('/designation/employees/delete/:id',async (req,res) => {
    let id = req.params.id;
    try{
        let result = await pool.query('DELETE FROM designation WHERE id= ?',[id]);
        if(result.affectedRows === 1){
            res.json({data:`Registro eliminado ${result.affectedRows}`});
        }else{
            res.json({data:`Id not found, ${result.affectedRows}`})
        }
    }catch(err){
        res.json({message:`Ha ocurrido un problema: ${err}`});
    }
});

module.exports = router;