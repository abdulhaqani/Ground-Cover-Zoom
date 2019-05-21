const mongoose = require('mongoose');

const { Schema } = mongoose;
/* User Schama
 * Schema for users, required
 * fields are Organization,
 * email, password. Non-required
 * fields are First and Lastname.
 */
const UserSchema = new Schema({

  organization: {
    type: String,
    require: true,
  },

  firstName: {
    type: String,
  },

  lastName: {
    type: String,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

mongoose.model('users', UserSchema);
