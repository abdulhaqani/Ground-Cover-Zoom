const keys = require('../keys');

if (process.env.NODE_ENV === 'production') {
  module.exports = {
    mongoURI: keys.MongoURI,
  };
} else {
  module.exports = { mongoURI: 'mongodb://localhost/vidjot-dev' };
}
