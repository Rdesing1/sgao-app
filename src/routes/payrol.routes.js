const express = require('express');
const router = express.Router();
const pool = require('../database.js');
const {isLoggedIn,isNotLoggedIn} = require('../lib/autch.js');
const multer = require('multer');
const fs = require('fs');
const path = require("path");
let date = Date.now();

let loadDocument = multer.diskStorage({
    destination:function(request,file,callback){
        callback(null,path.join('src','public','documents','payrols'));
    },
    filename:function(request,file,callback){
        console.log(file);
        callback(null,date+"_"+file.originalname);
    }
});

let saveDocument = multer({storage:loadDocument});

// get payrols views
router.get('/payrolls',async(req,res) =>{
    try{
        let payroll = [];
        let result = await pool.query('SELECT * FROM payroll');
        payroll = result;
        if(payroll.length > 0){
            res.render('payrol/index.ejs',{
                data:payroll
            });
            // res.status(200).json({data:payroll});
        }else{
            res.status(200).json({data:"No has guardado ninguna nomina."});
        }
        
    }catch(err){
        res.status(404).json({message:err});
    }
})

// get add payrols
router.get('/payrolls/add',(req,res) =>{
    res.render('payrol/add.ejs');
});

// post add payrols
router.post('/payrolls/add',saveDocument.single('document'),async (req,res)=>{
    let {fecha} = req.body;
    let data = {
        fecha:fecha,
        document:req.file.filename
    }
    try{
        let result = await pool.query("INSERT INTO payroll SET ?",[data]);
        // res.json({result});
        if(result.affectedRows === 1){
            res.render("payrol/add.ejs", {
                alert: true,
                titleDocument: `Guardado nomina ${result.insertId}`,
                alertTitle: `Nomina guardada`,
                alertMessage: `exito`,
                alertIcon: "success",
                showConfirmButtom: false,
                timer: 4500,
                ruta: "payrolls/"
            });
        }else{
            res.render("payrol/add.ejs", {
                alert: true,
                titleDocument: `Error`,
                alertTitle: `No fue posible guardar la nomina`,
                alertMessage: ` `,
                alertIcon: "error",
                showConfirmButtom: false,
                timer: 4500,
                ruta: "payrolls/"
            });
        }
       
    }catch(err){
        res.json({err});
    }
});

router.get('/payrolls/Dowload/:id',async (req,res) =>{
    let id = req.params.id;
    try{
        let payroll = [];
        let result = await pool.query("SELECT * FROM payroll WHERE id= ?",[id]);
        if(result.length > 0){
            payroll = result[0];
            let nameOfDocument = path.join('src','public','documents','payrols',`${payroll.document}`);
            res.download(nameOfDocument);
        }
    }catch(err){
        res.json({err});
    }
    // res.download();
})

// router.get('/payrolls/Update/:id',async(req,res) =>{
//     let id = req.params.id;
//     try{
//         let payrolls = [];
//         let result = await pool.query("SELECT * FROM payroll WHERE id= ?",[id]);
//         if(result.length > 0){
//             payrolls = result[0];
//             res.render('payrol/update.ejs',{
//                 data:payrolls
//             });
//         }
//     }catch(err){

//     }
// });


router.get('/payrolls/delete/:id',async(req,res) =>{
    let id = req.params.id;
    let names = [];
    try{
        let nameDocument = await pool.query('SELECT document from payroll WHERE id = ?',[id]);
        if(nameDocument.length > 0){
            names = nameDocument[0];
            let item = names.document;
            let nameOfDocument = path.join('src','public','documents','payrols',`${item}`);
            if(fs.existsSync(nameOfDocument)){
                fs.unlink(nameOfDocument,function(err){
                    if(err){
                        console.log(err);
                    }
                });
            }else{
                console.log('el archivo no existe!');
            }

            let result = await pool.query('DELETE FROM payroll WHERE id= ?',[id]);
            if(result.affectedRows === 1){
                res.render('payrol/index.ejs',{
                    alert: true,
                    titleDocument: `Nomina ${id}`,
                    alertTitle: `Borrada`,
                    alertMessage: `La nomina ha sido eliminada con exito.`,
                    alertIcon: "success",
                    showConfirmButtom: false,
                    timer: 4500,
                    ruta: "payrolls/"
                });
            }else{
                res.render('payrol/index.ejs',{
                    alert: true,
                    titleDocument: `Nomina ${id}`,
                    alertTitle: `No encontrada`,
                    alertMessage: `La nomina ${id} no existe.`,
                    alertIcon: "error",
                    showConfirmButtom: false,
                    timer: 4500,
                    ruta: "payrolls/"
                });
            }
        }else{
            res.render('payrol/index.ejs',{
                alert: true,
                titleDocument: `Nomina ${id}`,
                alertTitle: `No encontrada`,
                alertMessage: `La nomina ${id} no existe.`,
                alertIcon: "error",
                showConfirmButtom: false,
                timer: 4500,
                ruta: "payrolls/"
            });
        }
        
    }catch(err){
        res.status(404).json({message:`Ha ocurrido un problema ${err}`});
    }
});


module.exports = router;