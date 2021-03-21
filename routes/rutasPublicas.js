var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
  res.render('manejoDeUsuarios/LoginPage');
});

router.get("/signUp", (req,res)=>{
  res.render("manejoDeUsuarios/SignUpPage");
})

router.get("/validateAccount/:nombreDeUsuario", (req,res)=>{
  let nombreDeUsuario=  req.params.nombreDeUsuario;
  res.render("manejoDeUsuarios/ValidateAccountPage", {nombreDeUsuario:nombreDeUsuario})
})

router.get("/forgetPassword", (req, res)=>{
  res.render("manejoDeUsuarios/forgetPasswordPage")
})





module.exports = router;
