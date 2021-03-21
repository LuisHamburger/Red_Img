var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { Server } = require('http');
var session = require("express-session");


var publicasRouter = require('./routes/rutasPublicas');
var cuentasRouter = require('./routes/rutasControlUsuario');
var privadasRouter = require('./routes/rutasPrivadas');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'SosUnCrackHiperSecretot',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 144000000}
}))

app.use('/',publicasRouter);
app.use('/', cuentasRouter);
app.use('/', privadasRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, ()=>{
  console.log("Servidor Creado con Éxito");
});

module.exports = app;
