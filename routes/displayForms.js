/* eslint-disable prefer-const */
/* eslint-disable prefer-destructuring */
/* eslint-disable eqeqeq */
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const bodyParser = require('body-parser');

let fileName = '';
let imgPath = '';
const router = express.Router();
const { ensureAuthenticated } = require('../helpers/auth');

// body parser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

require('../models/DisplayForms');
require('../models/Users');

const DisplayForms = mongoose.model('displayForms');
const Users = mongoose.model('users');

// greenhouse page
router.get('/', ensureAuthenticated, (req, res) => {
  if (!fs.existsSync('./public/greenHouseImages')) {
    fs.mkdirSync('./public/greenHouseImages');
  }
  const fromImageFolder = './public/greenHouseImages';
  let b = [];
  fs.readdir(fromImageFolder, (err, files) => {
    files.forEach(file => {
      b.push(file);
    });
    if (b.length > 0) {
      let userId = req.user.id;
      DisplayForms.find({ User: userId }, (err, displayForms) => {
        if (displayForms != null) {
          displayForms.forEach(displayForm => {
            for (let i = 0; i < b.length; i += 1) {
              if (displayForm.FileName == b[i]) b[i] = '';
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
          imgPath = `/greenHouseImages/${fileName}`;
          res.render('displayForms/index', { imgPath });
        } else {
          fileName = '';
          imgPath = `/greenHouseImages/${fileName}`;
          res.render('displayForms/index', { imgPath });
        }
      });
    }
  });
});
// greenhouse retrain page
router.get('/greenhouseretrain', ensureAuthenticated, (req, res) => {
  if (!fs.existsSync('./public/allImages')) {
    fs.mkdirSync('./public/allImages');
  }
  let b = [];
  let c = [];
  DisplayForms.find({}, (err, displayForms) => {
    displayForms.forEach(displayForm => {
      if (err) throw err;
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
          (c[i].GreenHouse != c[j].GreenHouse ||
            c[i].SolarPanel != c[j].SolarPanel)
        ) {
          // if b doesn't already have this filename
          if (!b.includes(c[i].FileName)) b.push(c[i].FileName);
        }
      }
    }
    if (b.length == 0) {
      fileName = '';
    } else {
      // just chose first element because it shouldn't matter which copy is present. Once post is called it will be removed
      fileName = b[0];
    }
    imgPath = `/allImages/${fileName}`;
    res.render('displayForms/greenhouseretrain', { imgPath });
  });
});
// solar panel display form page
router.get('/solarpanel', ensureAuthenticated, (req, res) => {
  if (!fs.existsSync('./public/solarPanelImages')) {
    fs.mkdirSync('./public/solarPanelImages');
  }
  const fromImageFolder = './public/solarPanelImages';
  let b = [];
  fs.readdir(fromImageFolder, (err, files) => {
    files.forEach(file => {
      b.push(file);
    });
    if (b.length > 0) {
      let userId = req.user.id;
      DisplayForms.find({ User: userId }, (err, displayForms) => {
        if (displayForms != null) {
          displayForms.forEach(displayForm => {
            for (let i = 0; i < b.length; i += 1) {
              if (displayForm.FileName == b[i]) b[i] = '';
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
          imgPath = `/solarPanelImages/${fileName}`;
          res.render('displayForms/solarpanel', { imgPath });
        } else {
          fileName = '';
          imgPath = `/solarPanelImages/${fileName}`;
          res.render('displayForms/solarpanel', { imgPath });
        }
      });
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
        Classified: true,
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
        Classified: true,
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
        Classified: true,
        SolarPanel: true,
        GreenHouse: false,
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
        Classified: true,
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
        DisplayForms.find(
          { FileName: fileName, User: userId._id },
          (err, displayForm) => {
            if (
              req.body.solarPanel != displayForm.solarPanel ||
              req.body.GreenHouse != displayForm.GreenHouse
            )
              userId.update({ $inc: { Misclassified: 1 } }).exec();
          }
        );
      });
    });

    // Remove all classified (then reclassify one)
    DisplayForms.find({ FileName: fileName }, (err, displayForms) => {
      displayForms.forEach(displayForm => {
        displayForm.remove(() => {
          console.log('removed');
        });
      });
    });

    // mongodb classification
    if (req.body.solarPanel) {
      const newClassification = {
        FileName: fileName,
        Classified: true,
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
    } else {
      const newClassification = {
        FileName: fileName,
        Classified: true,
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
          let userId = req.user.id;
          Users.findOneAndUpdate(
            { _id: userId },
            { $inc: { TotalClassified: 1 } }
          ).exec();
          res.redirect('/displayForms/greenhouseretrain');
        })
        .catch(err => {
          throw err;
        });
    }
  } else res.redirect('/');
});

module.exports = router;
