const express = require('express');
const router = express.Router();
const pool = require('../database.js');
const {isLoggedIn} = require('../lib/autch.js');


// get assign
router.get('/assign',async (req,res) =>{
    try{
        let result = await pool.query("SELECT * FROM assignemployee");
        if(result.length > 0){
            res.render('assign/index.ejs',{
                assign:result
            });
        }
    }catch(err){
        res.json({message:"Ha ocurrido un problema", err});
    }
   
});

// agregar assign
router.get('/assign/add', async (req,res) =>{
     try{
        let users = await pool.query("SELECT users.id,users.name,users.typeUser, typeUser.role FROM users INNER JOIN typeUser ON users.typeUser=typeUser.id ORDER BY typeUser.role");
        let circuit = await pool.query("SELECT id,name FROM circuit");
        if(users.length > 0 && circuit.length > 0){    
            res.render("assign/add.ejs",{
                employees:users,
                circuit:circuit
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
        idUser11:employees,
        nameCircuit:circuit,
        dates:dates,
        entrance:entrance,
        exits:exits,
        idCircuit:idCircuit
    }
    try{
        let result = await pool.query("INSERT INTO assignemployee SET ?",[dataAssing]);
        if(result.affectedRows === 1){
            let dataassign = await pool.query(" select * from assignemployee order by id desc limit 1");
        
            if(dataassign[0].id > 0){
                const users_assignemployee = {
                    idUser7:dataassign[0].idUser11,
                    idAssignemployee1:dataassign[0].id 
                }

                console.log(users_assignemployee);
                let firstInsert = await pool.query("INSERT INTO users_assignemployee SET ?",[users_assignemployee]);
                if(firstInsert.affectedRows === 1){
                    res.render("charges/add.ejs", {
                        titleDocument: "Nueva asignacion",
                        alert: true,
                        alertTitle: "Asignacion enviada",
                        alertMessage: "Exito al crear la asignacion",
                        alertIcon: "success",
                        showConfirmButtom: false,
                        timer: 2500,
                        ruta: "assign/"
                    });
                }
            }    
        }

    }catch(err){
        res.status(404).json({message:"Ha ocurrido un problema. " ,err});
    }    
  
});

// delete assign
router.get('/assign/delete/:id',async(req,res) =>{
    let id = req.params.id;
    try {
        let result = await pool.query("DELETE FROM assignemployee WHERE id=?",[id]);
        if(result.affectedRows === 1){
            res.render("assign/index.ejs", {
                alert: true,
                alertTitle: "Eliminando la asignacion",
                alertHtml: "La asignacion se borrara en: ",
                timer: 2500,
                ruta: "/assign"
            });
            
        }
    } catch (err) {
        res.status(404).json({message:"Ha ocurrido un problema. " ,err});

    }
})

module.exports = router;