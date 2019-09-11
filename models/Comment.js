const mongoose = require('mongoose');

const { Schema } = mongoose;

const CommentSchema = new Schema({
  comment: {
    type: String,
    required: true,
  },
});

mongoose.model('comment', CommentSchema);
