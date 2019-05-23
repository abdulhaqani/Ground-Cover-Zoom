const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

require('../models/DisplayForms');

const DisplayForms = mongoose.model('displayForms');

// DisplayForms index page
router.get('/', (req, res) => {
  DisplayForms.find({})
    .sort({ date: 'desc' })
    .then(displayForms => {
      res.render('displayForms/index', {
        displayForms,
      });
    });
});

// Add displayForms form
router.get('/add', (req, res) => {
  res.render('displayForms/add');
});

// edit displayForms form
router.get('/edit/:id', (req, res) => {
  DisplayForms.findOne({
    _id: req.params.id,
  }).then(displayForm => {
    res.render('displayForms/edit', {
      displayForm,
    });
  });
});

// process form
router.post('/', (req, res) => {
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
router.put('/edit/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
  DisplayForms.deleteOne({ _id: req.params.id }).then(() => {
    req.flash('success_msg', 'displayForms removed');
    res.redirect('/displayForms');
  });
});

module.exports = router;
