const mongoose = require('mongoose');

const { Schema } = mongoose;

const DisplaySchema = new Schema({
  User: {
    type: String,
    required: true,
  },
  FileName: {
    type: String,
    required: true,
  },
  Classified: {
    type: String,
    required: true,
  },
  SolarPanel: {
    type: String,
    required: true,
  },
  GreenHouse: {
    type: String,
    required: true,
  },
  Lat: {
    type: String,
  },
  Lon: {
    type: String,
  },
});

mongoose.model('displayForms', DisplaySchema);
