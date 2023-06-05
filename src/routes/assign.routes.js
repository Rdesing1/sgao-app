const express = require('express');
const router = express.Router();
const pool = require('../database.js');
const {isLoggedIn} = require('../lib/autch.js');


// get assign


// agregar assign
router.get('/assign/add', async (req,res) =>{
     try{
        let employees = await pool.query("SELECT id,names from employees");
        let circuit = await pool.query("SELECT id,name from circuit");
        if(employees.length > 0 && circuit.length > 0){
            res.render("assign/add.ejs",{
                employees,
                circuit
            })
        }else{
            res.json("debes ingresar nuevos empleados");
        }
     }catch(err){
        res.json({message:"Ha ocurrido un problema", err});
     }
});



router.post('/assign/add',async (req,res) =>{
    let {employees,circuit,dates,entrance,exits,idCircuit} = req.body;
    let dataAssing = {
        nameEmployee:employees,
        nameCircuit:circuit,
        dates:dates,
        entrance:entrance,
        exits:exits,
        idCircuit:idCircuit
    }
    try{
        let result = await pool.query("INSERT INTO assignemployee SET ?",[dataAssing]);
        if(result.affectedRows === 1){
            res.send("asignacion creada!");
        }else{
            res.send("error. Intentelo de nuevo!");
        }
    }catch(err){
        res.json({message:"Ha ocurrido un problema", err});
    }
});


module.exports = router;