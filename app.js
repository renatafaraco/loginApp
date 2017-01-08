var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/loginapp');
var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');

//Initialize app
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs({defaultLayout:'layout.hbs'}));
app.set('view engine', 'hbs');


// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Set static forlder
app.use(express.static(path.join(__dirname, 'public')));

// Express session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

//Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.');
    var root = namespace.shift();
    var formParam = root;

    while(namespace.length) {
      formParam == '[' + namespace.shift() + ']';
    }
    return {
        param : formParam,
        msg : msg,
        value : value
    }
  }
}));

// connect flash middleware
app.use(flash());

// Global vars
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// Middleware for routes
app.use('/', routes);
app.use('/users', users);

/*// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
*/
app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function () {
    console.log('Server started on port ' + app.get('port') + '. Running...');
});