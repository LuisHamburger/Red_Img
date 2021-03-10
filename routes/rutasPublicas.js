var express = require('express');
var router = express.Router();


router.get('/login', function(req, res) {
  res.render('iniciarSesionPagina');
});

router.get("/signUp", (req,res)=>{
  res.render("registroPagina");
})


module.exports = router;
