const keys = require('../keys');

if (process.env.NODE_ENV === 'production') {
  module.exports = {
    mongoURI: keys.MongoUri,
  };
} else {
  module.exports = { mongoURI: keys.MongoLocal };
}
