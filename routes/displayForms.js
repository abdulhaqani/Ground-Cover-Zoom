/* eslint-disable eqeqeq */
const express = require('express');
const mongoose = require('mongoose');
const glob = require('glob');
const path = require('path');
const serveIndex = require('serve-index');

const router = express.Router();
const { ensureAuthenticated } = require('../helpers/auth');
require('../models/DisplayForms');

router.use('/images', serveIndex(path.join(__dirname, '/images')));

const DisplayForms = mongoose.model('displayForms');

// DisplayForms index page
router.get('/', (req, res) => {
  res.render('displayForms/index');
});

// Add displayForms form
router.get('/add', (req, res) => {
  res.render('displayForms/add');
});

// edit displayForms form
router.get('/edit/:id', (req, res) => {});

// process form
router.post('/', (req, res) => {
  const newImage = {};
  new DisplayForms(newImage).save().then(() => {
    req.flash('success_msg', 'Image added');
    res.redirect('/displayForms');
  });
});

// edit form process
router.put('/edit/:id', (req, res) => {});

/* // Delete displayForms
router.delete('/:id', ensureAuthenticated, (req, res) => {
  DisplayForms.deleteOne({ _id: req.params.id }).then(() => {
    req.flash('success_msg', 'displayForms removed');
    res.redirect('/displayForms');
  });
}); */

module.exports = router;
