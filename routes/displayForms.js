/* eslint-disable eqeqeq */
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const { ensureAuthenticated } = require('../helpers/auth');

require('../models/DisplayForms');

const DisplayForms = mongoose.model('displayForms');

// DisplayForms index page
router.get('/', (req, res) => {
  res.render('displayForms/index');
});

// Add displayForms form
router.get('/add', (req, res) => {
  res.render('displayForms/add');
});

// greenhouse post request
router.post('/', (req, res) => {
  const newClassification = {
    // image source
  };
  new DisplayForms(newClassification).save().then(() => {
    req.flash('success_msg', 'greenhouse classified');
    res.redirect('/displayForms');
  });
  console.log(req.body.greenHouse);
  console.log(req.body.solarPanel);
});

module.exports = router;
