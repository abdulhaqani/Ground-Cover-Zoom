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

// process form
router.post('/', (req, res) => {
  const newImage = {
    // image source
  };
  new DisplayForms(newImage).save().then(() => {
    req.flash('success_msg', 'displayForms added');
    res.redirect('/displayForms');
  });
});

module.exports = router;
