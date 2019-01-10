const mongoose = require('mongoose');

const Movie = mongoose.model('Movie');

exports.getAll = (req, res) => {
  Movie.find({ }, (error, movies) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.json(movies);
    }
  });
};
