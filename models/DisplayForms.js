const mongoose = require('mongoose');

const { Schema } = mongoose;

const DisplaySchema = new Schema({
  FileName: String,
  Classified: Boolean,
  SolarPanel: Boolean,
  GreenHouse: Boolean,
});

mongoose.model('displayForms', DisplaySchema);
