const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// load user model
const User = mongoose.model('users');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: 'email',
      },
      (email, password, done) => {
        console.log(email);
      }
    )
  );
};
