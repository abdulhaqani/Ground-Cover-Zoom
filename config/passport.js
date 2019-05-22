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
        // match correct user
        User.findOne({ email }).then(user => {
          if (!user) {
            return done(null, false, { message: 'No user found' });
          }
        

        // match correct password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } 
            return done(null, false, {message: 'password incorrect'});
        });
      }
    )
  );
};
