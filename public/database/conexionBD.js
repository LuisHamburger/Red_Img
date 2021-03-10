const sqlite3 = require("sqlite3");

let database = {};

database.conexion = new sqlite3.Database("./public/database/db.db", (error)=>{
    if(error){console.log("Error al conectar la Base de Datos")}
    else{console.log("Conexión a Base de datos Exitosa")}
});

module.exports = database;