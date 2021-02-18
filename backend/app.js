var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' })
var bodyParser = require('body-parser');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var memesRouter = require('./routes/samplememes');
var imageRouter = require('./routes/image');
var apiRouter = require('./routes/api');
global.memestore = [];

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(cookieParser());
app.use(upload.array()); 
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(upload.array()); 
app.use(bodyParser.json()); 

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/samplememes', memesRouter);
app.use('/image', imageRouter);
app.use('/api', apiRouter);


app.post('/', function(req, res){
  console.log(req.body);
  res.status(200).json({
    sucess: true,
    document: result
});
  res.send("recieved your request!");
});

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

module.exports = app;
