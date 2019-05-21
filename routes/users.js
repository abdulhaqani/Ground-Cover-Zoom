/* eslint-disable eqeqeq */
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Load user model
require('../models/Users');

const User = mongoose.model('users');
const router = express.Router();

// User login route
router.get('/login', (req, res) => {
  res.render('users/login');
});

// User register route
router.get('/register', (req, res) => {
  res.render('users/register');
});

// login form post
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/users/login',
    failureFlash: true,
  })(req, res, next);
});
// register form post
router.post('/register', (req, res) => {
  const errors = [];
  if (req.body.passwd1 != req.body.passwd2) {
    errors.push({ text: 'Passwords do not match' });
  }
  if (req.body.passwd1.length < 4) {
    errors.push({ text: 'Password must be at least 4 characters' });
  }
  if (errors.length > 0) {
    res.render('users/register', {
      errors,
      firstName: req.body.fname,
      lastName: req.body.lname,
      email: req.body.email,
      password: req.body.passwd1,
      password2: req.body.passwd2,
    });
  } else {
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        req.flash('error_msg', 'email already registered');
        res.redirect('/users/register');
      } else {
        const newUser = new User({
          fname: req.body.fname,
          lname: req.body.lname,
          email: req.body.email,
          password: req.body.passwd,
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(() => {
                req.flash('success_msg', 'you are now registered');
                res.redirect('/users/login');
              })
              .catch(err => {
                console.log(err);
              });
          });
        });
      }
    });
  }
});

module.exports = router;
