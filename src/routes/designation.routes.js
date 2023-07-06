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
        let result = await pool.query('SELECT designation.id,designation.estate,designation.description,designation.verificate,circuit.name,users.fullName FROM designation INNER JOIN circuit ON designation.idCircuit2=circuit.id INNER JOIN users ON designation.userId55=users.id WHERE designation.verificate <> true GROUP BY designation.id');
        designations = result;
        if(designations.length > 0){
            res.render('designation/index.ejs',{
                data:designations
            });
        }else{
            res.render('designation/index.ejs',{
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
        let result = await pool.query('SELECT designation.id,designation.estate,designation.description,designation.verificate,circuit.name,users.fullName FROM designation INNER JOIN circuit ON designation.idCircuit2=circuit.id INNER JOIN users ON designation.userId55=users.id WHERE designation.verificate = true and users.id=? GROUP BY designation.id',[designations.id]);
    
        if(result.length > 0){
            designation = result;
            res.render('designation/indexEmployeesdesignation.ejs',{
                data:designation
            });
        }else{

            res.render('designation/indexEmployeesdesignation.ejs',{
                data:'Sin asignaciones para enviar a verificar.'
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
        if(result.length > 0){
            circuit = result;
            res.render('designation/add.ejs',{
                data:circuit,
                id:id
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

router.post('/designation/employees/add', async(req,res) =>{
    let {state,description,idCircuit2,usuario} = req.body;
    let dataDesignation = {
        estate:state,
        description:description,
        idCircuit2:idCircuit2,
        userId55:usuario
    } 
    
    try{
    
        let result = await pool.query('INSERT INTO designation SET ?',[dataDesignation]);
        
        if(result.affectedRows === 1 ){
            res.render("designation/add.ejs", {
                data:'insertando data',
                titleDocument: "Agregar evaluacion",
                alert: true,
                alertTitle: "evalueacion guardada",
                alertMessage: `Exito al guardar la evaluacion numero: ${result.insertId}`,
                alertIcon: "success",
                showConfirmButtom: false,
                timer: 2500,
                ruta: "designation/employees"
            });
        }else{
            res.render("designation/add.ejs", {
                data:'insertando data',
                titleDocument: "No se registro la evaluacion",
                alert: true,
                alertTitle: "Error al guardar",
                alertMessage: `No es posible ingresar evaluaciones en este momento.`,
                alertIcon: "error",
                showConfirmButtom: false,
                timer: 2500,
                ruta: "designation/employees"
            });
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
    let userid = req.user.id;
    let id = req.params.id;
    try{    
        let designation = [];
        let result = await pool.query('SELECT * FROM designation WHERE id=?',[id]);
        designation = result;
        if(designation.length > 0){
            res.render('designation/update.ejs',{
                data:designation[0],
                userid:userid
            });

        }else{
            res.render("designation/update.ejs",{
                data:"No se ha actualizado la evaluacion.",
                alertThow: true,
                titleDocument: `Error`,
                alertTitle: "error",
                alertMessage: `el identificador no es correcto.`,
                alertIcon: "error",
                showConfirmButtom: false,
                timer: 2500,
                ruta: "designation/employees"
            });
        }
    }catch(err){
        res.status(404).json({message:`Ha ocurrido un problema ${err}`});
    }
});

// update designation of employees post 
router.post('/designation/employees/update/:id', async (req,res)=>{
    let id = req.params.id;
    let {estate,description,usuario} = req.body;
    let designationData = {
        estate:estate,
        description:description,
        userId55:usuario
    } 
    
    try{
        let result = await pool.query('UPDATE designation SET ? WHERE id= ?',[designationData,id]);
        if(result.affectedRows === 1){
            res.render("designation/update.ejs",{
                data:"Se ha actualizado la evaluacion!",
                alertThow: true,
                titleDocument: `Actualizar el Nucleo, numero ${id}`,
                alertTitle: "exito",
                alertMessage: `Nucleo numero ${id}, Actualizado`,
                alertIcon: "success",
                showConfirmButtom: false,
                timer: 2500,
                ruta: "designations"
            });
        }else{
            res.render("designation/update.ejs",{
                data:"No se ha actualizado la evaluacion.",
                alertThow: true,
                titleDocument: `Error`,
                alertTitle: "error",
                alertMessage: `el identificador no es correcto.`,
                alertIcon: "error",
                showConfirmButtom: false,
                timer: 2500,
                ruta: "designations"
            });
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
        let result = await pool.query('UPDATE designation set verificate = ? WHERE id= ?',[true,designation.id]);
        if(result.affectedRows === 1){
            res.render('designation/index.ejs',{
                data:'Verificando la evaluacion',
                alert: true,
                alertTitle: `verificando la evaluacion numero: ${designation.id}`,
                alertHtml: "La evaluacion se verificara en: ",
                timer: 2500,
                ruta: "/designations"
        
             });
        }else{
            res.render('designation/index.ejs',{
                data:"No se ha verificado la evaluacion.",
                alertThow: true,
                titleDocument: `Error`,
                alertTitle: "error",
                alertMessage: `el identificador no es correcto.`,
                alertIcon: "error",
                showConfirmButtom: false,
                timer: 2500,
                ruta: "/designations"
            })
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
            res.render('designation/indexEmployeesdesignation.ejs',{
                data:'Borrando la evaluacion',
                alert: true,
                alertTitle: `Borrando la evaluacion numero: ${id}`,
                alertHtml: "La evaluacion se borrara en: ",
                timer: 2500,
                ruta: "/designation/employees"
        
             });
        }else{
            res.render("designation/indexEmployeesdesignation.ejs",{
                data:"No se ha borrado la evaluacion.",
                alertThow: true,
                titleDocument: `Error el ${id} no es correcto.`,
                alertTitle: "error",
                alertMessage: `el identificador no es correcto.`,
                alertIcon: "error",
                showConfirmButtom: false,
                timer: 2500,
                ruta: "/designation/employees"
            });
        }
    }catch(err){
        res.json({message:`Ha ocurrido un problema: ${err}`});
    }
});

module.exports = router;