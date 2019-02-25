const async = require('async');
const mongoose = require('mongoose');

const Movie = mongoose.model('Movie');

exports.getAll = (req, res) => {
  const page = req.query.page || 1;

  const count = (callback) => Movie.count({}, callback);
  const query = (callback) => Movie.find({}, callback).lean().limit(20).skip((page - 1) * 20);

  async.parallel([count, query], (err, results) => {
    if (err) {
      res.status(500).send(error);
    } else {
      results[1].forEach((movie) => {
        movie.id = movie._id;
      })

      res.setHeader('Total-Results', results[0]);
      res.json(results[1]);
    }
  });
};
