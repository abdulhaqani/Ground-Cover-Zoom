/* eslint-disable prefer-destructuring */
/* eslint-disable eqeqeq */
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const bodyParser = require('body-parser');

let fileName = '';
let imgPath = '';
const router = express.Router();
const { ensureAuthenticated } = require('../helpers/auth');

// body parser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

require('../models/DisplayForms');

const DisplayForms = mongoose.model('displayForms');

// greenhouse page
router.get('/', ensureAuthenticated, (req, res) => {
  if (!fs.existsSync('./public/greenHouseImages')) {
    fs.mkdirSync('./public/greenHouseImages');
  }
  if (!fs.existsSync('./public/greenHousePresent')) {
    fs.mkdirSync('./public/greenHousePresent');
  }
  if (!fs.existsSync('./public/greenHouseNotPresent')) {
    fs.mkdirSync('./public/greenHouseNotPresent');
  }
  const fromImageFolder = './public/greenHouseImages';
  let i = 0;
  fs.readdirSync(fromImageFolder).forEach(file => {
    fileName = file;
    i += 1;
  });
  if (i == 0) {
    fileName = '';
  }
  imgPath = `/greenHouseImages/${fileName}`;
  res.render('displayForms/index', { imgPath });
});
// greenhouse retrain page
router.get('/greenhouseretrain', ensureAuthenticated, (req, res) => {
  if (!fs.existsSync('./public/allImages')) {
    fs.mkdirSync('./public/allImages');
  }
  let previousName = '';
  const a = [];
  DisplayForms.find()
    .all()
    .sort('FileName') // sort by  file name
    .exec(displayForm => {
      // for each
      const name = displayForm.FileName;
      // if copy
      if (name == previousName) {
        console.log(name);
        // if already put into array
        if (a.includes(name)) {
          console.log('already in');
        } else {
          // else put into array
          a.push(name);
        }
      }
      previousName = name;
    });
  // now array a has all copies
  // if no copies no file name for retraining
  if (a.length == 0) {
    fileName = '';
  } else {
    // just chose first element because it shouldn't matter which copy is present. Once post is called it will be removed
    fileName = a[0];
  }
  imgPath = `/allImages/${fileName}`;
  res.render('displayForms/greenhouseretrain', { imgPath });
});
// solar panel display form page
router.get('/solarpanel', ensureAuthenticated, (req, res) => {
  if (!fs.existsSync('./public/solarPanelImages')) {
    fs.mkdirSync('./public/solarPanelImages');
  }
  if (!fs.existsSync('./public/solarPanelPresent')) {
    fs.mkdirSync('./public/solarPanelPresent');
  }
  if (!fs.existsSync('./public/solarPanelNotPresent')) {
    fs.mkdirSync('./public/solarPanelNotPresent');
  }
  const fromImageFolder = './public/solarPanelImages';
  let i = 0;
  fs.readdirSync(fromImageFolder).forEach(file => {
    fileName = file;
    i += 1;
  });
  if (i == 0) {
    fileName = '';
  }
  imgPath = `/solarPanelImages/${fileName}`;
  res.render('displayForms/solarpanel', { imgPath });
});
// greenhouse post request
router.post('/', ensureAuthenticated, (req, res) => {
  let fileSource = '';
  let fileDest = '';
  if (fileName != '') {
    // create the destination folder depending on the req.body
    fileSource = path.join(
      __dirname,
      `./../public/greenHouseImages/${fileName}`
    );
    if (req.body.greenHouse) {
      fileDest = path.join(
        __dirname,
        `./../public/greenHousePresent/${fileName}`
      );
    } else {
      fileDest = path.join(
        __dirname,
        `./../public/greenHouseNotPresent/${fileName}`
      );
    }
    let zoom = '';
    let lat = '';
    let lon = '';
    const fileSplit = fileName.split('_');
    if (fileSplit.length > 2) {
      zoom = fileSplit[0];
      lat = fileSplit[1];
      lon = fileSplit[1];
    }
    // copy the file to the destination folder
    fs.copyFileSync(fileSource, fileDest, err => {
      if (err) return console.error(err);
      console.log('success');
    });
    // remove file from the origin folder
    fsExtra.remove(fileSource, err => {
      if (!err) {
        // classify image in mongodb
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
            GreenHouse: true,
            User: req.user.id,
            Zoom: zoom,
            Lat: lat,
            Lon: lon,
          };
          new DisplayForms(newClassification)
            .save()
            .then(() => {
              req.flash('success_msg', 'no greenhouse image classified');
              res.redirect('/displayForms');
            })
            .catch(err => {
              throw err;
            });
        }
      }
    });
  } else {
    // if no images left then redirect
    req.flash('error_msg', 'No Images left');
    res.redirect('/');
  }
});

// solarPanel post request
router.post('/solarpanel', ensureAuthenticated, (req, res) => {
  let fileSource = '';
  let fileDest = '';
  console.log(req.body.solarPanel);
  if (fileName != '') {
    // create the destination folder depending on the req.body
    fileSource = path.join(
      __dirname,
      `./../public/solarPanelImages/${fileName}`
    );
    if (req.body.solarPanel) {
      fileDest = path.join(
        __dirname,
        `./../public/solarPanelPresent/${fileName}`
      );
    } else {
      fileDest = path.join(
        __dirname,
        `./../public/solarPanelNotPresent/${fileName}`
      );
    }
    let zoom = '';
    let lat = '';
    let lon = '';
    const fileSplit = fileName.split('_');
    if (fileSplit.length > 2) {
      zoom = fileSplit[0];
      lat = fileSplit[1];
      lon = fileSplit[1];
    }
    // copy file to destination folder
    fs.copyFileSync(fileSource, fileDest, err => {
      if (err) return console.error(err);
      console.log('success');
    });
    // remove file from origin folder
    fsExtra.remove(fileSource, err => {
      if (!err) {
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
              req.flash('success_msg', 'Solar Panel image classified');
              res.redirect('/displayForms/solarpanel');
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
              req.flash('success_msg', 'no Solar Panel image classified');
              res.redirect('/displayForms/solarpanel');
            })
            .catch(err => {
              throw err;
            });
        }
      }
    });
  } else {
    // if no images left then redirect
    req.flash('error_msg', 'No Images left');

    res.redirect('/');
  }
});

module.exports = router;
