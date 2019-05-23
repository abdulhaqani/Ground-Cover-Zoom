const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// load user model
const User = mongoose.model('users');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'passwd',
      },
      (email, password, done) => {
        // match user
        User.findOne({
          email,
        }).then(user => {
          console.log(user);
          if (!user) {
            return done(null, false, { message: 'No user found' });
          }

          // match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            }
            return done(null, false, { message: 'password incorrect' });
          });
        });
      }
    )
  );

  // serialize
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
