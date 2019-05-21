/* eslint-disable import/no-absolute-path */
// Defining global consts for the webserver
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const handlebars = require('express-handlebars').create({
  defaultLayout: 'main',
});

// load routes
const greenhouse = require('./routes/greenhouse');
const users = require('./routes/users');

// require models
require('./models/Greenhouse');

// model instance
const Green = mongoose.model('green');

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

// connect to mongoose
mongoose
  .connect('mongodb://127.0.0.1/greenhouse-dev', {
    useNewUrlParser: true,
  })
  .then(() => console.log('connected to mongodb'))
  .catch(err => console.log(err));

mongoose.connection
  .once('open', () => {
    console.log('connected to greenhouse-dev');
  })
  .on('error', error => {
    console.log('connection error');
  });

// handlebars middleware
const app = express();
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// express middleware
app.use(express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);

// method override middleware
app.use(methodOverride('_method'));

// Home page routing
app.get('/', (req, res) => {
  res.render('home');
});

app.post('/login', (req, res) => {
  console.log(req.body);
});

app.post('/req-proc', (req, res) => {
  console.log('bla');
});
// use routes
// app.use('/greenhouse', greenhouse);
app.use('/users', users);

app.listen(app.get('port'), () => {
  console.log('-------------------------------------------');
  console.log('==> Node Webserver Started on Port 3000 <==');
  console.log('-------------------------------------------');
});
