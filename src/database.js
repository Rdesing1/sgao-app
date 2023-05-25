const mysql = require("mysql");
const {promisify} = require('util');
const {dataDB} = require("./keys.js");

const pool = mysql.createPool(dataDB);

pool.getConnection((err,connection) =>{
    if(err){
        console.log('Ha ocurrido un error en la base de datos '+ err);
        if(err == "Error: connect ECONNREFUSED ::1:3306"){
            console.log("Enciende los servicios de mysql. BD no conectada.");
        }
    }else if(connection){
        connection.release();
        console.log('conexion establecida');
        return;
    }
});

pool.query = promisify(pool.query);

module.exports = pool;
