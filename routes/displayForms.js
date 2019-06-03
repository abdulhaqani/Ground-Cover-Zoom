/* eslint-disable eqeqeq */
const express = require('express');
const mongoose = require('mongoose');
const glob = require('glob');

const router = express.Router();
const { ensureAuthenticated } = require('../helpers/auth');

const images = glob(
  './public/pictures/{*.jpg,*.png,*.gif, *.jpeg}',
  glob.GLOB_BRACE
);

require('../models/DisplayForms');

const DisplayForms = mongoose.model('displayForms');

// DisplayForms index page
router.get('/', ensureAuthenticated, (req, res) => {});

// Add displayForms form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('displayForms/add');
});

// edit displayForms form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {});

// process form
router.post('/', ensureAuthenticated, (req, res) => {
  const newUser = {};
  new DisplayForms(newUser).save().then(() => {
    req.flash('success_msg', 'Image added');
    res.redirect('/displayForms');
  });
});

// edit form process
router.put('/edit/:id', ensureAuthenticated, (req, res) => {});

/* // Delete displayForms
router.delete('/:id', ensureAuthenticated, (req, res) => {
  DisplayForms.deleteOne({ _id: req.params.id }).then(() => {
    req.flash('success_msg', 'displayForms removed');
    res.redirect('/displayForms');
  });
}); */

module.exports = router;
