const mongoose = require('mongoose');

const { Schema } = mongoose;

const DisplaySchema = new Schema({
  img: {
    data: Buffer,
    contentType: String,
  },
});

mongoose.model('displayForms', DisplaySchema);
