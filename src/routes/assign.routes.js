const express = require('express');
const router = express.Router();
const pool = require('../database.js');
const {isLoggedIn} = require('../lib/autch.js');
const { jsPDF } = require("jspdf"); 
const fs = require('fs');
const path = require('path');
const moments = require('moment');


// generate pdf;
router.get('/assign/generate-pdf', async (req,res)=>{
    let assign = [];
    const data = {};
   try{
    const dataAssign = await pool.query("SELECT assignemployee.id as id, users.fullName as fullName, circuit.name as circuit, assignemployee.dates as fecha, assignemployee.entrance as entrada, assignemployee.exits as salida FROM assignemployee INNER JOIN circuit ON assignemployee.idCircuit=circuit.id INNER JOIN users ON assignemployee.idUser11=users.id ");
    assign = dataAssign;
    
   function generateData(){
        let result = [];

        for(let i=0; i<assign.length; i++){

                result.push(Object.assign({}, {
                ID: String(assign[i].id),
                Nombre: String(assign[i].fullName),
                Circuito: String(assign[i].circuit),
                Fecha: String(assign[i].fecha),
                Entrada: String(assign[i].entrada),
                Salida: String(assign[i].salida),

             }));
        }
        return result;
   }

   let headers =[
    "ID",
    "Nombre",
    "Circuito",
    "Fecha",
    "Entrada",
    "Salida"

];

    // console.table(generateData());
    let image = fs.readFileSync('./unerg.png').toString('base64'); 
    let doc = new jsPDF('l', 'pt', 'a4');
				doc.addImage(image, 'png', 70, 80, 100, 50);
				
				moments.locale('es-do');
				doc.setFontSize(10);
				doc.text(moments().format('LLLL'), 20, 20);

				doc.setFontSize(10);
				doc.text("DIRECCION DE SEGURIDAD DE LA UNERG:", 230, 102);

				doc.setFontSize(10);
				doc.text("RIF:j-000000-000", 250, 128);

				doc.setFontSize(12);
                console.log(doc.getFontList());
				doc.setFont("Times", "bold");
				doc.text("REPORTE DE ASIGNACIONES ACTUALES", 4, 210);

				doc.table(4, 230, generateData(), headers, {
					left:300,
					top:0,
					right:300,
					bottom: 0,
					width: 2000,
					});

							
				 if(!fs.existsSync(path.join('src','public','documents','assign')))

					fs.mkdir(path.join('src','public','documents','assign'), (err)=>{
                        if(err){
                            return console.error(err);
                        }
                        console.log('creado satisfactoriamente!');
                        

                    })

				 doc.save( path.join('src','public','documents','assign', Date.now().toString() +'-reporte.pdf'));
                 res.render('assign/index.ejs',{
                    alert: true,
                    alertTitle: "Creando documento pdf",
                    alertHtml: "El documento se creara en: ",
                    timer: 2500,
                    ruta: "/assign"
                 });

   }catch(err){
        res.json({message:'error al generar documento!',err});
   }

});

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


// agg new assign
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

// update assign
router.get('/assign/update/:id', async (req,res)=>{
    let id = req.params.id;
    try{ 
        let employees = await pool.query("SELECT users.id,users.name,users.typeUser, typeUser.role FROM users INNER JOIN typeUser ON users.typeUser=typeUser.id ORDER BY typeUser.role");
        let circuit = await pool.query("SELECT id,name FROM circuit");
        let result = await pool.query('SELECT * FROM assignemployee WHERE id=?',[id]);
        if(result){
            res.render('assign/update.ejs',{
                data:result[0],
                employees:employees,
                circuit:circuit
            });
        }
    }catch(err){
        res.status(404).json({message:'asignacion no encontrada.'});
    }
});

// update assign add;
router.post('/assign/update/:id',async (req,res) =>{
    let id = req.params.id;
    let {employees,circuit,idCircuit,dates,entrance,exits} = req.body;
    const dataAssign = {
        idUser11:employees,
        nameCircuit:circuit,
        dates:dates,
        entrance:entrance,
        exits:exits,
        idCircuit:idCircuit
    }
    // res.json({id:id,params:dataAssign});
    try{
        const result = await pool.query('UPDATE assignemployee SET ? WHERE id= ?',[dataAssign,id]);
        if(result.affectedRows === 1){
            res.render("assign/index.ejs", {
                alert: true,
                alertTitle: "Actualizando la asignacion",
                alertHtml: "La asignacion se actualizara en: ",
                timer: 2500,
                ruta: "/assign"
            });
        }
    }catch(err){
        res.status(404).json({message:'error al actualizar. ', err});
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
});

module.exports = router;