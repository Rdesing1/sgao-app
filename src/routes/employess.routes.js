const express = require('express');
const router = express.Router();
const pool = require('../database.js');
const {isLoggedIn} = require('../lib/autch.js');

// get all employess
router.get('/employees',isLoggedIn,async(req,res) =>{
    const dataEmployees = await pool.query("SELECT id, ci,names,lastNames,idUser4,idCharge4,charges.name FROM employees INNER JOIN charges ON employees.idCharge4=charges.idcharge");
    // res.json({dataEmployees});
        res.render("employees/index.ejs",{
            dataEmployees
        });
});

// save employees
router.get('/employees/add',isLoggedIn,async(req,res) =>{
    try {
        const dataCharges = await pool.query("SELECT idcharge,name FROM charges");
        const cores = await pool.query("SELECT id__Core, name FROM core");
        res.render("employees/add.ejs",{
            charges:dataCharges,
            core:cores
        });
    } catch (err) {
        res.json({message:"ha ocurrido un problema.",err});
    }
    
});


router.post("/employees/add",isLoggedIn, async (req,res) =>{
    const {ci,names,lastNames,codigo,cargo,idCore4} = req.body;
    const dataEmployees = {
        ci:ci,
        names:names,
        lastNames:lastNames,
        idUser4:codigo,
        idCharge4:cargo,
        idCore4:idCore4 	 	
    }
    try{
        const result = await pool.query("INSERT INTO employees SET ?",[dataEmployees]);
        if(result.affectedRows === 1){
            res.send("Se ha cargado el empleado. proximamente habra una redireccion y una alerta de confirmacion");
        }
    }catch(err){
        if(err.code == "ER_NO_REFERENCED_ROW_2"){res.json({Message:"El id no exist"})
        }else{
            res.json({massage:err});
        }
    }


});

// update employees vista
router.get('/employees/update/:id',isLoggedIn,async (req,res) =>{
    let id = req.params.id;
    const employees = await pool.query("SELECT id, ci,names,lastNames,idUser4,idCharge4,charges.name FROM employees INNER JOIN charges ON employees.idCharge4=charges.idcharge WHERE employees.id =?",[id]);
    res.render("employees/update.ejs",{
        data:employees[0]
    })
});

// update employees vista
router.post('/employees/update/:id',isLoggedIn, async (req,res) =>{
    const id = req.params.id;
    const {ci,names,lastNames,idUser4,idCharge4} = req.body;
    const newEmployees = {
        ci:ci,
        names:names,
        lastNames:lastNames,
        idUser4:idUser4,
        idCharge4:idCharge4
    }
    try{
        const newData = await pool.query("UPDATE employees SET ? WHERE id=?",[newEmployees,id]);
        if(newData.affectedRows === 1){
            res.json({message:"actualizado con exito"});
        }
    }catch(err){
        res.json({err});
    } 
});


router.get('/employees/delete/:id',isLoggedIn, async (req,res) =>{
    let id = req.params.id;
    try{
        const result = await pool.query("DELETE FROM employees WHERE id=?",[id]);
        if(result.affectedRows === 1){
            res.json({message:"borrado con exito!"});
        }else{
            res.json({message:"el registro no existe"});
        }
    }catch(err){
        res.json({message:"ha ocurrido un error:  " + err})
    }
});

module.exports = router;