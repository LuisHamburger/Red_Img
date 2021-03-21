var express = require('express');
var router = express.Router();
var session = require("express-session")
var database = require("../public/database/conexionBD");
let db = database.conexion;

router.get("/home", async (req, res)=>{
    if(Object.keys(req.session).length == 2){
        let str = "SELECT * FROM publicaciones"
        await db.all(str, (error, filas)=>{
            if(error){console.log(error)}
            else{;res.render("paginasPrivadas/homePage",  {username : req.session.usuario.nombreUsuario, filas: filas})}
        })
    }else{res.redirect("/")}
     
})

router.get("/profile:username", async (req, res)=>{
    if(Object.keys(req.session).length == 2){
        let str = "SELECT * FROM publicaciones WHERE autor='"+req.session.usuario.nombreUsuario+"'";
        await db.all(str, (error, filas)=>{
            if(error){console.log(error)}
            else{res.render("paginasPrivadas/profilePage", {username: req.session.usuario.nombreUsuario, foto: req.session.usuario.fotoUsuario, filas:filas})}
        })}
    else{res.redirect("/")}
        
})

router.post("/publicar", async (req, res)=>{
    if(Object.keys(req.session).length == 2){
    let contenido = req.body.contenido;
    let autor = req.session.usuario.nombreUsuario;
    let fecha = new Date();
    let dia = fecha.getDate();
    let mes = fecha.getMonth();
    let año = fecha.getFullYear();
    let fechaPublicacion;
    if(mes < 10){fechaPublicacion = dia +"/0"+mes+"/"+año; }
    else{fechaPublicacion = dia +"/"+mes+"/"+año;}

    let str = "INSERT INTO publicaciones (contenido, autor, fecha) VALUES ('"+contenido+"','"+autor+"','"+fechaPublicacion+"')";
    db.run(str, (error)=>{console.log("Error al insertar publicacion")})
    res.redirect("/home")
    }

    res.redirect("/")

})


router.get("/eliminarPublicacion/:id", (req, res)=>{
    if(Object.keys(req.session).length == 2){
        let id = parseInt(req.params.id) 
        let str = "DELETE FROM publicaciones WHERE id ="+id;
        db.run(str, (error)=>{
            if(error){console.log(error)}
            else(res.redirect("/profile:"+ req.session.usuario.nombreUsuario))
        });
    }else{res.redirect("/")}
})

module.exports = router;