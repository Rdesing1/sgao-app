const express = require('express');
const router = express.Router();
const pool = require('../database.js');
const {isLoggedIn} = require('../lib/autch.js');
const { jsPDF } = require("jspdf"); 
const fs = require('fs');
const path = require('path');
const moments = require('moment');

// get all employess
router.get('/employees',isLoggedIn,async(req,res) =>{
    const dataEmployees = await pool.query("SELECT id,ci,names,lastNames,idUser4,idCharge4,charges.name as charges_name ,core.name as core_name FROM employees INNER JOIN charges ON employees.idCharge4=charges.idcharge INNER JOIN core ON employees.idCore4=core.id__Core");
    // res.json({dataEmployees});
        res.render("employees/index.ejs",{
            dataEmployees
        });
});

// get pdf
router.get('/employess/generate-pdf', async (req,res) => {
    let employees = [];
    const data = {};
    const dataEmployees = await pool.query("SELECT id,ci,names,lastNames,idUser4,idCharge4,charges.name as charges_name ,core.name as core_name FROM employees INNER JOIN charges ON employees.idCharge4=charges.idcharge INNER JOIN core ON employees.idCore4=core.id__Core");
    employees = dataEmployees;
    
   function generateData(){
        let result = [];

        for(let i=0; i<employees.length; i++){

                result.push(Object.assign({}, {
                ID: String(employees[i].id),
                Nombres: String(employees[i].names),
                Apellidos: String(employees[i].lastNames),
                Usuario: String(employees[i].idUser4),
                Cargo: String(employees[i].charges_name),
                Nucleo: String(employees[i].core_name),

             }));
        }
        return result;
   }

   let headers =[
    "ID",
    "Nombres",
    "Apellidos",
    "Usuario",
    "Cargo",
    "Nucleo"

];

    // console.table(generateData());
    let image = fs.readFileSync('./unerg.png').toString('base64'); 
    let doc = new jsPDF('p', 'pt', 'a4');
				doc.addImage(image, 'png', 70, 80, 100, 50);
				
				moments.locale('es-do');
				doc.setFontSize(10);
				doc.text(moments().format('LLLL'), 20, 20);

				doc.setFontSize(10);
				doc.text("ESTANTERIAS EL SOL C.A", 230, 102);

				doc.setFontSize(10);
				doc.text("RIF:j-07554653-9", 250, 128);

				doc.setFontSize(12);
                console.log(doc.getFontList());
				doc.setFont("Times", "bold");
				doc.text("REPORTE DE INVENTARIO DEL MODULO DE LAMINAS", 4, 210);

				doc.table(4, 230, generateData(), headers, {
					left:300,
					top:0,
					right:300,
					bottom: 0,
					width: 2000,
					});

					console.log();			
				 if(!fs.existsSync(path.join('src','public','documents','employees')))

					fs.mkdir(path.join('src','public','documents','employees'), (err)=>{
                        if(err){
                            return console.error(err);
                        }
                        console.log('creado satisfactoriamente!');
                        

                    })

				 doc.save( path.join('src','public','documents','employees', Date.now().toString() +'-reporte.pdf'));


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
    try {
        const employees = await pool.query("SELECT id, ci,names,lastNames,idUser4,idCharge4,charges.name,core.name as nombre_nucle FROM employees INNER JOIN charges ON employees.idCharge4=charges.idcharge INNER JOIN core ON employees.idCore4=core.id__Core WHERE employees.id = ?",[id]);
        const dataCharges = await pool.query("SELECT idcharge,name FROM charges");
        const cores = await pool.query("SELECT id__Core, name FROM core");
        res.render("employees/update.ejs",{
            data:employees[0],
            charges:dataCharges,
            core:cores

    })
    } catch (error) {
        
    }
});

// update employees save
router.post('/employees/update/:id',isLoggedIn, async (req,res) =>{
    const id = req.params.id;
    const {ci,names,lastNames,idUser4,idCharge4,idCore4} = req.body;
    const newEmployees = {
        ci:ci,
        names:names,
        lastNames:lastNames,
        idUser4:idUser4,
        idCharge4:idCharge4,
        idCore4:idCore4
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