const express = require('express');
const router = express.Router();
const pool = require('../database.js');
const {isLoggedIn} = require('../lib/autch.js');


// get all core
router.get('/core', isLoggedIn ,async (req,res) =>{
    try{
        let cores = [];
        let result = await pool.query("SELECT * FROM core");
        cores = result;

        if(cores.length > 0){
            res.render('cores/index.ejs',{
                data:cores
            });
        }else{
            res.json({message:"No se han encontrado registros"});  
        }
    }catch(err){
        res.json({message:"Ha ocurrido un problema. " + err});  
    }
});

// get core
router.get('/core/search/:id', async (req,res) =>{
    let id = req.params.id;
    try{
        let result = await pool.query("SELECT * FROM core WHERE id__Core = ?",[id]);
        if(result.length > 0){
            res.json({
                message:"core encontrado",
                data:result[0]
            });
        }else{
            res.json({message:"el core no existe"});
        }
    }catch(err){
        res.json({message:"Ha ocurrido un problema.",err});
    }
});


// add core get
router.get('/core/add',(req,res) =>{
    res.render('cores/add.ejs');
});


// add new core 
router.post('/core/add', async (req,res)=>{
    const {name,location} = req.body;
    const coreData = {
        name:name,
        location:location
    }
    try{
        let result = await pool.query("INSERT INTO core SET ?",[coreData]);
        if(result.affectedRows === 1){
            res.render("cores/index.ejs", {
                alertThow: true,
                titleDocument: `Agreando nuevo Nucleo.`,
                alertTitle: "Success",
                alertMessage: "Nuecleo creado.",
                alertIcon: "Success",
                showConfirmButtom: false,
                timer: 2500,
                ruta: "core/"
            });
            
        }
       
    }catch(err){
        res.render("cores/index.ejs", {
            alertThow: true,
            titleDocument: `Error.`,
            alertTitle: `contacte al programador`,
            alertMessage: `${err}`,
            alertIcon: "error",
            showConfirmButtom: false,
            timer: 2500,
            ruta: "core/"
        });
    } 

});


//get and update core:
router.get('/core/update/:id', isLoggedIn , async (req,res) =>{
    let id = req.params.id;
    try{
        let cores = [];
        const result = await pool.query('SELECT * FROM core WHERE id__Core = ?',[id]);
        cores = result;
        if(cores.length > 0){
            res.render('cores/update.ejs',{
                data:cores[0]
            });
        }else{
            res.render("cores/index.ejs", {
                alertThow: true,
                titleDocument: `Actualizar el Nucleo, numero ${id}`,
                alertTitle: "Error",
                alertMessage: "Nuecleo no encontrado.",
                alertIcon: "error",
                showConfirmButtom: false,
                timer: 2500,
                ruta: "core/"
            });
        }
    }catch(err){
        res.render("cores/index.ejs", {
            alertThow: true,
            titleDocument: `Actualizar el Nucleo, numero ${id}`,
            alertTitle: "Error",
            alertMessage: `contacte con el programador, error: ${err}`,
            alertIcon: "error",
            showConfirmButtom: false,
            timer: 2500,
            ruta: "core/"
        });
    }
});

// update core
router.post('/core/update/:id',async (req,res) => {
    let id = req.params.id;
    let {name,location} = req.body;
    const dataCore = {
        name:name,
        location:location
    }
    try{
        let result = await pool.query("UPDATE core SET ? WHERE id__Core = ?",[dataCore,id]);
        if(result.affectedRows === 1){
            res.render("cores/index.ejs", {
                alertThow: true,
                titleDocument: `Actualizar el Nucleo, numero ${id}`,
                alertTitle: "Success",
                alertMessage: `Nucleo numero ${id}, Actualizado`,
                alertIcon: "success",
                showConfirmButtom: false,
                timer: 2500,
                ruta: "core/"
            });
        }else{
            res.render("cores/index.ejs", {
                alertThow: true,
                titleDocument: `Nucleo no encontrado`,
                alertTitle: "Error",
                alertMessage: `Nucleo numero ${id}, no encontrado o no existe`,
                alertIcon: "error",
                showConfirmButtom: false,
                timer: 2500,
                ruta: "core/"
            });
        }
    }catch(err){
        res.render("cores/index.ejs", {
            alertThow: true,
            titleDocument: `Actualizar el Nucleo, numero ${id}`,
            alertTitle: "Error",
            alertMessage: `contacte con el programador, error: ${err}`,
            alertIcon: "error",
            showConfirmButtom: false,
            timer: 2500,
            ruta: "core/"
        });
    }
});


// delete core

router.get('/core/delete/:id', async (req,res) =>{
    let id = req.params.id;
    try{
        let result = await pool.query("DELETE FROM core WHERE id__Core = ?",[id]);//DELETE FROM charges WHERE id=?", [id]
        if(result.affectedRows === 1){
            res.render('cores/index.ejs',{
                alert: true,
                alertTitle: `Borrado el nucleo Numero: ${id}`,
                alertHtml: "El Nucleo se borrara en: ",
                timer: 2500,
                ruta: "/core"
        
             })
        }else{
            res.json({message:"el core no se ha podido eliminar"});
        }
    }catch(err){
        res.render("cores/index.ejs", {
            alertThow: true,
            titleDocument: `Error.`,
            alertTitle: `No puedes borrar un nucleo al que pertenezca un empleado.`,
            alertMessage: `actualiza o crea un nuevo nucleo`,
            alertIcon: "warning",
            showConfirmButtom: false,
            timer: 4500,
            ruta: "core/"
        });
    } 
    
});


module.exports = router;