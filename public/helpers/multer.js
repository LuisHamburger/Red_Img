var multer = require("multer");


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../images/fotosDePerfil')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

var upload = multer({ storage: storage })

exports.module = upload;
