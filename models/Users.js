const mongoose = require('mongoose');

const { Schema } = mongoose;
/* User Schama
 * Schema for users, required
 * fields are Organization,
 * email, password. Non-required
 * fields are First and Lastname.
 * Date is auto generated
 * TotalClassified and Misclassified are
 * updated upon classifications by users.
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
  TotalClassified: {
    type: Number,
    default: 0,
  },
  Misclassified: {
    type: Number,
    default: 0,
  },
});

mongoose.model('users', UserSchema);
