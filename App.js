var DBUtils = require('./config/DBUtils')
var MQTTUtils = require('./config/MQTTUtils')
var Aggregateur = require('./script/Aggregateur')
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
const cors = require('cors')
var myArgs = process.argv.slice(2);


var app = express();

app.use(cors())
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

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

app.set('conn',DBUtils.connect())
MQTTUtils.init(myArgs)
app.set('client',MQTTUtils.connect())
MQTTUtils.receiveMessage(app.get('client'), app.get('conn'));

module.exports = app;