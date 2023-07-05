const express = require('express');
const router = express.Router();
const pool = require('../database.js');
const {isLoggedIn} = require('../lib/autch.js');


router.get('/assigned',isLoggedIn, async (req,res) =>{
    let id = req.user.id;
    try{
        let assigned = [];
        const result = await pool.query("SELECT users.id, users.fullName, typeuser.role, assignemployee.nameCircuit, assignemployee.dates,assignemployee.entrance,assignemployee.exits FROM users_assignemployee INNER JOIN users ON users_assignemployee.idUser7=users.id INNER JOIN typeuser ON users.typeUser=typeuser.id INNER JOIN assignemployee ON users_assignemployee.idAssignemployee1=assignemployee.id WHERE users.id = ?",[id]);
        
        if(result.length > 0){
                assigned = result;
                res.render('assigned/index.ejs',{
                data:assigned
            });
        }else{
            assigned = `No cuentas con asignaciones para hoy. Codigo de usuario: ${req.user.id}`;
            res.render('assigned/index.ejs',{
                data:assigned
            });
        }
    }catch(err){
        res.status(404).json({message:`ha currido un problema: ${err}`});
    }
});

module.exports = router