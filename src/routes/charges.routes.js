const express = require('express');
const router = express.Router();
const pool = require('../database.js');
const {isLoggedIn} = require('../lib/autch.js');

// ruta para mostrar los cargos

router.get('/charges',isLoggedIn, async (req, res) => {
    const dataCharges = await pool.query("SELECT * FROM charges");
    console.log(dataCharges);
    res.render('charges/index.ejs', {
        dataCharges
    });
});

// ruta para mostrar el formulario de agg cargo

router.get('/charges/add', isLoggedIn, (req, res) => {
    res.render('charges/add.ejs');
});

// ruta para guardar los cargos 
router.post('/charges/add/',isLoggedIn, async (req, res) => {
    const { name, description } = req.body;
    const dataCharge = {
        name: name,
        responsability: description
    }
    await pool.query("INSERT INTO charges SET ?", [dataCharge]);
    res.render("charges/add.ejs", {
        titleDocument: "Agregar cargos",
        alert: true,
        alertTitle: "Guardar cargo",
        alertMessage: "Exito al guardar el cargo",
        alertIcon: "success",
        showConfirmButtom: false,
        timer: 2500,
        ruta: "charges/"
    });
});

router.get('/charges/update/:id', isLoggedIn ,async (req,res) =>{
    let id = req.params.id;
    let {name,description} =  req.body;
    objCharge = {
        name:name,
        responsability:description	
    }
    if(objCharge.name != 'undefined' || objCharge.responsability != 'undefined'){
        try{
            let charges = [];
            const response = await pool.query('SELECT * FROM charges WHERE idcharge = ?',[id]);
            charges = response;
            if(charges.length > 0){
                // res.json({data:charges[0]})
                res.render('charges/update.ejs',{
                    data:charges[0]
                });
            }else{
                res.render("charges/index.ejs", {
                    alertThow: true,
                    titleDocument: `Actualizar el cargo, numero ${id}`,
                    alertTitle: "Error",
                    alertMessage: "Cargo no encontrado.",
                    alertIcon: "error",
                    showConfirmButtom: false,
                    timer: 2500,
                    ruta: "charges/"
                });
            }
        }catch(err){
            res.render("charges/index.ejs", {
                alertThow: true,
                titleDocument: `No se encontro el ${id}`,
                alertTitle: "Error",
                alertMessage: "Error al actualizar el cargo",
                alertIcon: "error",
                showConfirmButtom: false,
                timer: 2500,
                ruta: "charges/"
            });
        }
    }else{
        res.redirect('/charges');
    }


});

// ruta para Actualizar los cargos 
router.post('/charges/update/:id',isLoggedIn, async (req, res) => {
    let id = req.params.id;
    const {name,responsability} = req.body;
    const Description = {
        name,
        responsability
    }
    try{
        const result = await pool.query("UPDATE charges SET ? WHERE idcharge = ?", [Description, id]);
        if(result.affectedRows === 1){
            res.render("charges/index.ejs", {
                alert: true,
                alertTitle: "Actualizando el cargo",
                alertHtml: "El cargo se actualizara en: ",
                timer: 2500,
                ruta: "/charges"
            });
        }else{
            res.render("charges/index.ejs", {
                alertThow: true,
                titleDocument: `No se encontro el ${id}`,
                alertTitle: "Error",
                alertMessage: "Error al actualizar el cargo",
                alertIcon: "error",
                showConfirmButtom: false,
                timer: 2500,
                ruta: "charges/"
            });
        }
        
    }catch(err){
        res.status(404).json({message:err});
    }
});

// ruta para eliminar los cargos 
router.get('/charges/delete/:id', isLoggedIn, async (req, res) => {
    const id = req.params.id;
    await pool.query("DELETE FROM charges WHERE idcharge=?", [id]);
    res.render("charges/index.ejs", {
        alert: true,
        alertTitle: "Borrar el cargo",
        alertHtml: "El cargo se borrara en: ",
        timer: 2500,
        ruta: "/charges"
    });

});


function recorText(textArea) {
    let textAreas = textArea;
    let newText = textAreas.trim();
    return newText;
}


module.exports = router;