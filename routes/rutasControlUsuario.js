var express = require("express");
var router = express.Router();
var database = require("../public/database/conexionBD");
var bcrypt = require("bcrypt");
var mailer = require("../public/helpers/nodemailer")
var upload = require("../public/helpers/multer");
const session = require("express-session");
let db = database.conexion;
let mail = mailer.transporter;



router.post("/ingresar", async (req, res)=>{
    
    let nombreOcorreo = req.body.nombreOcorreo;
    let contraseña = req.body.contraseña;
    let str = "SELECT * FROM usuarios WHERE correo ='"+nombreOcorreo+"' OR nombreDeUsuario ='"+nombreOcorreo+"'";
    console.log(str)
    await db.all(str, async (error, fila)=>{
        if(error){console.log("Error al buscar correo "+error)}
        else{
            if(fila.length == 1){
                if(await bcrypt.compare(contraseña, fila[0].contraseña)){
                    req.session.usuario= {
                        idUsuario : fila[0].id,
                        nombreUsuario : fila[0].nombreDeUsuario, 
                        correoUsuario : fila[0].correo,
                        fotoUsuario : fila[0].fotoDePerfil, 
                        validacion : true
                    }                  
                    res.redirect("/home");
                }else{res.redirect("/")} 
            }else{res.redirect("/");} 
        }
    })
});

router.post("/registrar", upload.single("fotoDePerfil"), async (req, res)=>{

    let nombreDeUsuario = req.body.nombreDeUsuario;
    let correo = req.body.correo;
    let fotoDePerfil= req.file.path;
    let contraseña = req.body.contraseña;

    //Validar si el correo ya está relacionado con un usuario
  
    await bcrypt.hash(contraseña, 10, (error, contraseñaEncriptada)=>{
        if(error){console.log("Error al encriptar contraseña")}
        else{
            let str = "INSERT INTO usuarios (correo, nombreDeUsuario, fotoDePerfil, contraseña, activate) VALUES ('"+correo+"','"+nombreDeUsuario+"','"+fotoDePerfil+"','"+contraseñaEncriptada+"',false)";
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
        html: '<h2 style="text-align:center;">Validar Cuenta</h2> <br> <p>Click <a href="http://localhost:3000/validateAccount/'+nombreDeUsuario+'">aquí</a> para validar tu cuenta</p>' // html body
      });

});

router.get("/salir", (req, res)=>{
    req.session.destroy((error)=>{console.log("Error al cerrar sesión")})
    res.redirect("/");
})

router.post("/validarCuenta/:nombreDeUsuario", async (req, res)=>{

    let nombreDeUsuario = req.params.nombreDeUsuario;
    console.log(nombreDeUsuario)
    let correo = req.body.correo;
    let str = "UPDATE usuarios SET activate=true WHERE nombreDeUsuario ='"+nombreDeUsuario+"' AND correo ='"+correo+"'";

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
        html: '<h2 style="text-align:center;">Restablecer Contraseña</h2> <br> <p>Click <a href="http://localhost:3000/passwordResetPage/'+correo+'">aquí</a> para restablecer tu contraseña</p>' // html body
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

