/* eslint-disable prefer-const */
/* eslint-disable prefer-destructuring */
/* eslint-disable eqeqeq */
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const bodyParser = require('body-parser');

// variables
let fileName = '';
let imgPath = '';
const router = express.Router();
const { ensureAuthenticated } = require('../helpers/auth');

// body parser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// bringing in the models
require('../models/DisplayForms');
require('../models/Users');

// Model variables
const DisplayForms = mongoose.model('displayForms');
const Users = mongoose.model('users');

// greenhouse page
router.get('/', ensureAuthenticated, (req, res) => {
  // create dir to prevent errors
  if (!fs.existsSync('./public/allImages')) {
    fs.mkdirSync('./public/allImages');
  }
  const fromImageFolder = './public/allImages';
  let b = [];
  fs.readdir(fromImageFolder, (err, files) => {
    // add file names to array

    files.forEach(file => {
      b.push(file);
    });
    // if there are file names
    if (b.length > 0) {
      let userId = req.user.id;
      // find in the database based on current user
      DisplayForms.find({ User: userId }, (err, displayForms) => {
        // if there are values to based on the query
        if (displayForms != null) {
          // for each query result, if the FileName is the same then set fileName to '' because the user already classified it
          displayForms.forEach(displayForm => {
            for (let i = 0; i < b.length; i += 1) {
              if (
                displayForm.FileName == b[i] &&
                displayForm.ClassifiedGreenhouse == 'true'
              )
                b[i] = '';
            }
          });
          console.log(
            `files that have not been classified by user ${
              req.user.id
            } are ${b}`
          );
          fileName = '';
          for (let i = 0; i < b.length; i += 1) {
            if (b[i] != '') fileName = b[i];
          }
          if (fileName == '') {
            imgPath = `/images/noImage.png`;
            res.render('displayforms/index', { imgPath });
          } else {
            imgPath = `/allImages/${fileName}`;
            res.render('displayForms/index', { imgPath });
          }
        } else {
          imgPath = `/images/noImage.png`;
          res.render('displayforms/solarpanel', { imgPath });
        }
      });
    } else {
      imgPath = `/images/noImage.png`;
      res.render('displayforms/index', { imgPath });
    }
  });
});

// solar panel display form page
router.get('/solarpanel', ensureAuthenticated, (req, res) => {
  // create dir to prevent errors
  if (!fs.existsSync('./public/allImages')) {
    fs.mkdirSync('./public/allImages');
  }
  const fromImageFolder = './public/allImages';
  let b = [];
  // add file names to array
  fs.readdir(fromImageFolder, (err, files) => {
    files.forEach(file => {
      b.push(file);
    });
    // if there is at least 1 file
    if (b.length > 0) {
      let userId = req.user.id;
      // db search query
      DisplayForms.find({ User: userId }, (err, displayForms) => {
        // if results from query compare fileNames, if the same then edit array
        if (displayForms != null) {
          displayForms.forEach(displayForm => {
            for (let i = 0; i < b.length; i += 1) {
              if (
                displayForm.FileName == b[i] &&
                displayForm.ClassifiedSolarPanel == 'true'
              )
                b[i] = '';
            }
          });
          console.log(
            `files that have not been classified by user ${
              req.user.id
            } are ${b}`
          );
          fileName = '';
          // if array only has empty file names, the user already classified it
          for (let i = 0; i < b.length; i += 1) {
            if (b[i] != '') fileName = b[i];
          }
          if (fileName == '') {
            imgPath = `/images/noImage.png`;
            res.render('displayforms/solarpanel', { imgPath });
          } else {
            imgPath = `/allImages/${fileName}`;
            res.render('displayForms/solarpanel', { imgPath });
          }
        } else {
          imgPath = `/images/noImage.png`;
          res.render('displayforms/solarpanel', { imgPath });
        }
      });
    } else {
      imgPath = `/images/noImage.png`;
      res.render('displayforms/solarpanel', { imgPath });
    }
  });
});

// greenhouse retrain page
router.get('/greenhouseretrain', ensureAuthenticated, (req, res) => {
  // create dir to prevent errors
  if (!fs.existsSync('./public/allImages')) {
    fs.mkdirSync('./public/allImages');
  }
  let b = [];
  let c = [];
  DisplayForms.find({}, (err, displayForms) => {
    if (err) throw err;
    displayForms.forEach(displayForm => {
      c.push(displayForm);
    });
    // now array a has all copies
    // if no copies no file name for retraining
    // for all duplicates
    for (let i = 0; i < c.length; i += 1) {
      for (let j = i; j < c.length; j += 1) {
        // if false positive or false negative
        if (
          i != j &&
          c[i].FileName == c[j].FileName &&
          c[i].ClassifiedGreenhouse == 'true' &&
          c[j].ClassifiedGreenhouse == 'true' &&
          c[i].GreenHouse != c[j].GreenHouse
        ) {
          // if b doesn't already have this filename
          if (!b.includes(c[i].FileName)) b.push(c[i].FileName);
        }
        if (
          i != j &&
          c[i].FileName == c[j].FileName &&
          c[i].ClassifiedSolarPanel == 'true' &&
          c[j].ClassifiedSolarPanel == 'true' &&
          c[i].SolarPanel != c[j].SolarPanel
        ) {
          // if b doesn't already have this filename
          if (!b.includes(c[i].FileName)) b.push(c[i].FileName);
        }
      }
    }
    if (b.length == 0) {
      imgPath = `/images/noImage.png`;
      res.render('displayForms/greenhouseretrain', { imgPath });
    } else {
      // just chose first element because it shouldn't matter which copy is present. Once post is called it will be removed
      fileName = b[0];
      imgPath = `/allImages/${fileName}`;
      res.render('displayForms/greenhouseretrain', { imgPath });
    }
  });
});

// greenhouse post request
router.post('/', ensureAuthenticated, (req, res) => {
  if (fileName != '') {
    let zoom = '';
    let lat = '';
    let lon = '';
    const fileSplit = fileName.split('_');
    if (fileSplit.length > 2) {
      zoom = fileSplit[0];
      lat = fileSplit[1];
      lon = fileSplit[1];
    }
    if (req.body.greenHouse) {
      const newClassification = {
        FileName: fileName,
        ClassifiedGreenhouse: 'true',
        ClassifiedSolarPanel: 'false',
        SolarPanel: 'N/a',
        GreenHouse: true,
        User: req.user.id,
        Zoom: zoom,
        Lat: lat,
        Lon: lon,
      };
      new DisplayForms(newClassification)
        .save()
        .then(() => {
          req.flash('success_msg', 'greenhouse image classified');
          let userId = req.user.id;
          Users.findOneAndUpdate(
            { _id: userId },
            { $inc: { TotalClassified: 1 } }
          ).exec();
          res.redirect('/displayForms');
        })
        .catch(err => {
          throw err;
        });
    } else {
      const newClassification = {
        FileName: fileName,
        ClassifiedGreenhouse: 'true',
        ClassifiedSolarPanel: 'false',
        SolarPanel: 'N/a',
        GreenHouse: false,
        User: req.user.id,
        Zoom: zoom,
        Lat: lat,
        Lon: lon,
      };
      new DisplayForms(newClassification)
        .save()
        .then(() => {
          req.flash('success_msg', 'image classified');
          let userId = req.user.id;
          Users.findOneAndUpdate(
            { _id: userId },
            { $inc: { TotalClassified: 1 } }
          ).exec();
          res.redirect('/displayForms');
        })
        .catch(err => {
          throw err;
        });
    }
  } else {
    // if no images left then redirect
    req.flash('error_msg', 'No Images left');
    res.redirect('/');
  }
});

// solarPanel post request
router.post('/solarpanel', ensureAuthenticated, (req, res) => {
  if (fileName != '') {
    let zoom = '';
    let lat = '';
    let lon = '';
    const fileSplit = fileName.split('_');
    if (fileSplit.length > 2) {
      zoom = fileSplit[0];
      lat = fileSplit[1];
      lon = fileSplit[1];
    }
    if (req.body.greenHouse) {
      const newClassification = {
        FileName: fileName,
        ClassifiedGreenhouse: 'false',
        ClassifiedSolarPanel: 'true',
        SolarPanel: true,
        GreenHouse: 'N/a',
        User: req.user.id,
        Zoom: zoom,
        Lat: lat,
        Lon: lon,
      };
      new DisplayForms(newClassification)
        .save()
        .then(() => {
          req.flash('success_msg', 'solar panel image classified');
          let userId = req.user.id;
          Users.findOneAndUpdate(
            { _id: userId },
            { $inc: { TotalClassified: 1 } }
          ).exec();
          res.redirect('/displayForms/solarPanel');
        })
        .catch(err => {
          throw err;
        });
    } else {
      const newClassification = {
        FileName: fileName,
        ClassifiedGreenhouse: 'false',
        ClassifiedSolarPanel: 'true',
        SolarPanel: false,
        GreenHouse: 'N/a',
        User: req.user.id,
        Zoom: zoom,
        Lat: lat,
        Lon: lon,
      };
      new DisplayForms(newClassification)
        .save()
        .then(() => {
          req.flash('success_msg', 'image classified');
          let userId = req.user.id;
          Users.findOneAndUpdate(
            { _id: userId },
            { $inc: { TotalClassified: 1 } }
          ).exec();
          res.redirect('/displayForms/solarPanel');
        })
        .catch(err => {
          throw err;
        });
    }
  } else {
    // if no images left then redirect
    req.flash('error_msg', 'No Images left');
    res.redirect('/');
  }
});

// greenhouse retrain post request
router.post('/greenhouseretrain', ensureAuthenticated, (req, res) => {
  if (fileName != '') {
    let zoom = '';
    let lat = '';
    let lon = '';
    const fileSplit = fileName.split('_');
    if (fileSplit.length > 2) {
      zoom = fileSplit[0];
      lat = fileSplit[1];
      lon = fileSplit[1];
    }

    // Update misclassified
    Users.find({}, (err, users) => {
      users.forEach(userId => {
        DisplayForms.findOne(
          { FileName: fileName, User: userId._id },
          (err, displayForm) => {
            if (
              (req.body.solarPanel != displayForm.solarPanel &&
                req.body.ClassifiedSolarPanel ==
                  displayForm.ClassifiedSolarPanel) ||
              (req.body.GreenHouse != displayForm.GreenHouse &&
                req.body.ClassifiedGreenhouse ==
                  displayForm.ClassifiedGreenhouse)
            ) {
              if (userId._id == displayForm.User)
                userId.update({ $inc: { Misclassified: 1 } }).exec();
            }
          }
        );
      });
    });

    // Remove all classified (then reclassify one)
    DisplayForms.find({ FileName: fileName }, (err, displayForms) => {
      displayForms.forEach(displayForm => displayForm.remove());
    });

    // mongodb classification
    if (req.body.solarPanel) {
      const newClassification = {
        FileName: fileName,
        ClassifiedGreenhouse: 'true',
        ClassifiedSolarPanel: 'true',
        SolarPanel: false,
        GreenHouse: true,
        User: req.user.id,
        Zoom: zoom,
        Lat: lat,
        Lon: lon,
      };
      new DisplayForms(newClassification)
        .save()
        .then(() => {
          req.flash('success_msg', 'Image reclassified');
          res.redirect('/displayForms/greenhouseretrain');
        })
        .catch(err => {
          throw err;
        });
    } else if (req.body.greenHouse) {
      const newClassification = {
        FileName: fileName,
        ClassifiedGreenhouse: 'true',
        ClassifiedSolarPanel: 'true',
        SolarPanel: false,
        GreenHouse: true,
        User: req.user.id,
        Zoom: zoom,
        Lat: lat,
        Lon: lon,
      };
      new DisplayForms(newClassification)
        .save()
        .then(() => {
          req.flash('success_msg', 'image reclassified');
          res.redirect('/displayForms/greenhouseretrain');
        })
        .catch(err => {
          throw err;
        });
    } else if (req.body.both) {
      const newClassification = {
        FileName: fileName,
        ClassifiedGreenhouse: 'true',
        ClassifiedSolarPanel: 'true',
        SolarPanel: true,
        GreenHouse: true,
        User: req.user.id,
        Zoom: zoom,
        Lat: lat,
        Lon: lon,
      };
      new DisplayForms(newClassification)
        .save()
        .then(() => {
          req.flash('success_msg', 'image reclassified');
          res.redirect('/displayForms/greenhouseretrain');
        })
        .catch(err => {
          throw err;
        });
    } else {
      const newClassification = {
        FileName: fileName,
        ClassifiedGreenhouse: 'true',
        ClassifiedSolarPanel: 'true',
        SolarPanel: false,
        GreenHouse: false,
        User: req.user.id,
        Zoom: zoom,
        Lat: lat,
        Lon: lon,
      };
      new DisplayForms(newClassification)
        .save()
        .then(() => {
          req.flash('success_msg', 'image reclassified');
          res.redirect('/displayForms/greenhouseretrain');
        })
        .catch(err => {
          throw err;
        });
    }
  } else res.redirect('/');
});

module.exports = router;
