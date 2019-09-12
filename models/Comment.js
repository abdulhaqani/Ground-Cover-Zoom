const mongoose = require('mongoose');

const { Schema } = mongoose;

const CommentSchema = new Schema({
  Comment: {
    type: String,
    required: true,
  },
});

mongoose.model('comments', CommentSchema);
