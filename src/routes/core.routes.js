const express = require('express');
const router = express.Router();
const pool = require('../database.js');
const {isLoggedIn} = require('../lib/autch.js');


// get all core
router.get('/core', async (req,res) =>{
    try{
        let cores = await pool.query("SELECT * FROM core");
        if(cores.length > 0){
            res.json({
                message:"se han encontrado los cores",
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
router.get('/core/:id', async (req,res) =>{
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

// add new core 
router.post('/core/add',async (req,res)=>{
    const {name,location} = req.body;
    const coreData = {
        name:name,
        location:location
    }
    try{
        let result = await pool.query("INSERT INTO core SET ?",[coreData]);
        if(result.affectedRows === 1){
            res.json({result});
        }else{
            res.json({message:"err al registrar los valores enviados desde el formulario."});
        }
       
    }catch(err){
        res.json({message:err});
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
        res.json({message:"registro actualizado correctamente."});
    }catch(err){
        res.json({message:"error al actualizar.", err});
    }
});

// delete core

router.get('/core/delete/:id', async (req,res) =>{
    let id = req.params.id;
    try{
        let result = await pool.query("DELETE FROM core WHERE id__Core = ?",[id]);//DELETE FROM charges WHERE id=?", [id]
        if(result.affectedRows === 1){
            res.json({message:"core eliminado correctamente"});
        }else{
            res.json({message:"el core no se ha podido eliminar"});
        }
    }catch(err){
        res.json({message:"Ha ocurrido un problema.", err});
    }
});


module.exports = router;