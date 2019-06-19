const mongoose = require('mongoose');

const { Schema } = mongoose;

const DisplaySchema = new Schema({
  FileName: String,
  Classified: Boolean,
  SolarPanel: Boolean,
  GreenHouse: Boolean,
  Lat: String,
  Lon: String,
});

mongoose.model('displayForms', DisplaySchema);
