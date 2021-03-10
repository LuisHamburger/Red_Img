var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
  res.render('manejoDeUsuarios/LoginPage');
});

router.get("/signUp", (req,res)=>{
  res.render("manejoDeUsuarios/SignUpPage");
})

router.get("/validateAccount/:telefono", (req,res)=>{
  let telefono =  parseInt(req.params.telefono);
  res.render("manejoDeUsuarios/ValidateAccountPage", {telefono: telefono})
})

router.get("/forgetPassword", (req, res)=>{
  res.render("manejoDeUsuarios/forgetPasswordPage")
})




module.exports = router;
