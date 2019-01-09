const https = require('https');
const mongoose = require('mongoose');

const Movie = mongoose.model('Movie');

exports.getAll = (req, res) => {
  Movie.find({ }, (error, movies) => {
    if (error) {
      res.error(error);
    } else {
      res.json(movies);
    }
  });
};
