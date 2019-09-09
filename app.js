/* eslint-disable import/no-absolute-path */
// Defining global consts for the webserver
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const handlebars = require('express-handlebars').create({
  defaultLayout: 'main',
});

const app = express();

// load routes
const displayForms = require('./routes/displayForms');
const users = require('./routes/users');

// require models
require('./models/Users');
require('./models/DisplayForms');

// db config
const db = require('./config/database');

// connect to mongoose
mongoose
  .connect(db.mongoURI, {
    useNewUrlParser: true,
  })
  .then(() => console.log('connected to mongodb'))
  .catch(err => console.log(err));

// model instance
const Display = mongoose.model('displayForms');
const User = mongoose.model('users');

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

// connections
mongoose.connection
  .once('open', () => {
    console.log('connected to greenhouse-dev');
  })
  .on('error', error => {
    console.log('connection error');
  });

// passport config
require('./config/passport')(passport);

// MIDDLEWARE
// static folder
app.use(express.static(path.join(__dirname, 'public')));

// handlebars middleware
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// express middleware
app.use(express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);

// session middleware
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);

// Flash middleware
app.use(flash());

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// method override middleware
app.use(methodOverride('_method'));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.err = req.flash('err');
  res.locals.user = req.user || null;
  next();
});

// ROUTING
// Home page routing
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

// use routes
app.use('/displayForms', displayForms);
app.use('/users', users);

app.listen(app.get('port'), () => {
  console.log('-------------------------------------------');
  console.log('==> Node Webserver Started on Port 3000 <==');
  console.log('-------------------------------------------');
});
