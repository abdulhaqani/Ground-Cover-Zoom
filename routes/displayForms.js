/* eslint-disable eqeqeq */
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const LinkedList = require('singly-linked-list');
const fsExtra = require('fs-extra');
const path = require('path');

let fileName = '';

const router = express.Router();
const { ensureAuthenticated } = require('../helpers/auth');

require('../models/DisplayForms');

const fromImageFolder = './public/pictures/';

const DisplayForms = mongoose.model('displayForms');

// DisplayForms index page
router.get('/', ensureAuthenticated, (req, res) => {
  res.render('displayForms/index');
});

// greenhouse post request
router.post('/', ensureAuthenticated, (req, res) => {
  let i = 0;
  fs.readdirSync(fromImageFolder).forEach(file => {
    fileName = file;
    i += 1;
  });
  if (i == 0) {
    fileName = '';
  }
  let fileSource = '';
  let fileDest = '';

  if (fileName != '') {
    fileSource = path.join(__dirname, `./../public/pictures/${fileName}`);
    fileDest = path.join(__dirname, `./../public/toFolder/${fileName}`);
    fs.copyFileSync(fileSource, fileDest, err => {
      if (err) return console.error(err);
      console.log('success');
    });
    fsExtra.remove(fileSource, err => {
      if (!err) {
        const newClassification = {
          FileName: fileName,
          Classified: true,
          SolarPanel: false,
          GreenHouse: true,
        };
        new DisplayForms(newClassification)
          .save()
          .then(() => {
            req.flash('success_msg', 'greenhouse classified');
            res.redirect('/displayForms');
          })
          .catch(err => {
            throw err;
          });
      }
    });
  } else {
    req.flash('error_msg', 'No Images left');

    res.redirect('/');
  }
});

module.exports = router;
