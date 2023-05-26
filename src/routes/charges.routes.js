const express = require('express');
const router = express.Router();
const pool = require('../database.js');

// ruta para mostrar los cargos

router.get('/charges', async (req,res) =>{
    const dataCharges = await pool.query("SELECT * FROM charges");
    console.log(dataCharges);
    res.render('charges/index.ejs',{
        dataCharges
    });
});

// ruta para mostrar el formulario de agg cargo

router.get('/charges/add',(req,res) =>{
    res.render('charges/add.ejs');
});

// ruta para guardar los cargos 
router.post('/charges/add/', async (req,res) =>{
    const {name,description} = req.body;
    const dataCharge ={
        name:name,
        responsability:description
    }    
    console.log(dataCharge);
    await pool.query("INSERT INTO charges SET ?",[dataCharge]);
    res.render("charges/add.ejs",{
        titleDocument:"Agregar cargos",
        alert:true,
        alertTitle:"Guardar cargo",
        alertMessage:"Exito al guardar el cargo",
        alertIcon:"success",
        showConfirmButtom:false,
        timer:2500,
        ruta:"charges/"
    });
});    

// ruta para Actualizar los cargos 
router.post('/charges/update/', async (req,res) =>{
    const {nameThow,descriptionThow} = req.body;
    let textArea = recorText(descriptionThow);
    let {idThow} = req.body;
    const Description = {
        name:nameThow,
        responsability:textArea
    }
    await pool.query("UPDATE charges SET ? WHERE id=?",[Description,idThow]);
    res.render("charges/index.ejs",{
        alert:true,
        alertTitle:"Actualizando el cargo",
        alertHtml:"El cargo se actualizara en: ",
        timer:2500,
        ruta:"/charges"
    });
});

// ruta para eliminar los cargos 
router.get('/charges/delete/:id', async (req,res) =>{
    const id = req.params.id;
    await pool.query("DELETE FROM charges WHERE id=?",[id]);
    res.render("charges/index.ejs",{
        alert:true,
        alertTitle:"Borrar el cargo",
        alertHtml:"El cargo se borrara en: ",
        timer:2500,
        ruta:"/charges"
    });

});


function recorText(textArea){
    let textAreas = textArea;
    let newText = textAreas.trim();
    return newText;
}


module.exports = router;