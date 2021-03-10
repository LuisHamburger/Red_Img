var express = require("express");
var router = express.Router();
var database = require("../public/database/conexionBD");
var bcrypt = require("bcrypt");
var mailer = require("../public/helpers/nodemailer")

let db = database.conexion;
let mail = mailer.transporter;


router.post("/ingresar", async (req, res)=>{
    
    let correo = req.body.correo;
    let contraseña = req.body.contraseña;
    let str = "SELECT * FROM usuarios WHERE correo ='"+correo+"'";

    await db.all(str, async (error, fila)=>{
        if(error){console.log("Error al buscar correo "+error)}
        else{
            if(fila.length == 1){
                if(await bcrypt.compare(contraseña, fila[0].contraseña)){
                    res.send("Ok")
                }else{res.send("Bad")} 
            }else{res.send("Bad")} 
        }
    })
});

router.post("/registrar", async (req, res)=>{

    let nombre = req.body.nombre;
    let correo = req.body.correo;
    let telefono = req.body.telefono;
    let contraseña = req.body.contraseña;

    //Validar si el correo ya está relacionado con un usuario
  
    await bcrypt.hash(contraseña, 10, (error, contraseñaEncriptada)=>{
        if(error){console.log("Error al encriptar contraseña")}
        else{
            let str = "INSERT INTO usuarios (correo, nombre, telefono, contraseña, activate) VALUES ('"+correo+"','"+nombre+"','"+telefono+"','"+contraseñaEncriptada+"',false)";
            db.run(str, (error)=>{
                if(error){console.log("Error al registrar usuario "+error)}
                else{console.log("Usuario creado con éxito"), res.send("Bien")};
            });
        };
    });


    await mail.sendMail({
        from: '"BookHam👻" <pruebaproyectosluish@gmail.com>', // sender address
        to: correo, // list of receivers
        subject: "Validar cuenta✔", // Subject line
        text: "Bienvenido a BookHam", // plain text body
        html: '<h2 style="text-align:center;">Validar Cuenta</h2> <br> <p>Click <a href="http://localhost:3000/validateAccount/'+telefono+'">aquí</a> para validar tu cuenta</p>' // html body
      });

});


router.post("/validarCuenta/:telefono", async (req, res)=>{

    let telefono = parseInt(req.params.telefono);
    console.log(telefono)
    let correo = req.body.correo;
    let str = "UPDATE usuarios SET activate=true WHERE telefono ="+telefono+" AND correo ='"+correo+"'";

    console.log(str)
    db.run(str, (error)=>{
        if(error){console.log("Error al activar")}
        else{console.log("Activación correcta"); res.send("Bien Activate")}
    })

})

router.post("/passwordEmail", async (req, res)=>{

    let correo = req.body.correo
    
    await mail.sendMail({
        from: '"BookHam👻" <pruebaproyectosluish@gmail.com>', // sender address
        to: correo, // list of receivers
        subject: "Restablecer contraseña✔", // Subject line
        text: "Bienvenido a BookHam", // plain text body
        html: '<h2 style="text-align:center;">Validar Cuenta</h2> <br> <p>Click <a href="http://localhost:3000/passwordResetPage/'+correo+'">aquí</a> para validar tu cuenta</p>' // html body
      });

})

router.get("/passwordResetPage/:email", (req, res)=>{
    let correo = req.params.email
    res.render("manejoDeUsuarios/passwordResetPage", {correo : correo})
})

router.post("/passwordReset/:email", async (req,res)=>{
    let  correo = req.params.email;
    let contraseña = req.body.contraseña;

    await bcrypt.hash(contraseña, 10, (error, contraseñaEncriptada)=>{
        if(error){console.log("Error al encriptar contraseña")}
        else{
            let str = "UPDATE usuarios SET contraseña='"+contraseñaEncriptada+"' WHERE correo ='"+correo+"'";
            db.run(str, (error)=>{
                if(error){console.log("Error al cambiar contraseña "+error)}
                else{console.log("Contraseña cambiada con éxito"), res.send("Bien")};
            });
        };
    });

})

module.exports= router;

