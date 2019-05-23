/* eslint-disable eqeqeq */
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const { ensureAuthenticated } = require('../helpers/auth');

require('../models/DisplayForms');

const DisplayForms = mongoose.model('displayForms');

// DisplayForms index page
router.get('/', ensureAuthenticated, (req, res) => {
  DisplayForms.find({ user: req.user.id })
    .sort({ date: 'desc' })
    .then(displayForms => {
      res.render('displayForms/index', {
        displayForms,
      });
    });
});

// Add displayForms form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('displayForms/add');
});

// edit displayForms form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  DisplayForms.findOne({
    _id: req.params.id,
  }).then(displayForm => {
    if (displayForm.user != req.user.id) {
      req.flash('error_msg', 'Not authorized');
      res.redirect('/displaForms/');
    }
    res.render('displayForms/edit', {
      displayForm,
    });
  });
});

// process form
router.post('/', ensureAuthenticated, (req, res) => {
  const errors = [];
  if (!req.body.title) {
    errors.push({ text: 'please add a title' });
  }
  if (!req.body.details) {
    errors.push({ text: 'please add a details' });
  }

  if (errors.length > 0) {
    res.render('displayForms/add', {
      errors,
      title: req.body.title,
      details: req.body.details,
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
    };
    new DisplayForms(newUser).save().then(() => {
      req.flash('success_msg', 'displayForms added');
      res.redirect('/displayForms');
    });
  }
});

// edit form process
router.put('/edit/:id', ensureAuthenticated, (req, res) => {
  DisplayForms.findOne({
    _id: req.params.id,
  }).then(displayForms => {
    displayForms.title = req.body.title;
    displayForms.details = req.body.details;

    displayForms.save().then(() => {
      req.flash('success_msg', 'displayForms updated');
      res.redirect('/displayForms');
    });
  });
});

// Delete displayForms
router.delete('/:id', ensureAuthenticated, (req, res) => {
  DisplayForms.deleteOne({ _id: req.params.id }).then(() => {
    req.flash('success_msg', 'displayForms removed');
    res.redirect('/displayForms');
  });
});

module.exports = router;
