const nodemailer = require("nodemailer");

mailer = {};

mailer.transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "pruebaproyectosluish@gmail.com", // generated ethereal user
      pass: "zkdzlzkyatfajpgv", // generated ethereal password
    },
  });


module.exports = mailer;