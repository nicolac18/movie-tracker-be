const mongoose = require('mongoose');

const Movie = mongoose.model('Movie');

exports.create = (req, res) => {
  const movie = new Movie(req.body);

  movie.save((err, mov) => {
    if (err) {
      res.send(err);
    } else {
      res.json(mov);
    }
  });
};

exports.delete = (req, res) => {
  const { id } = req.params;

  Movie.remove({ _id: id }, (err) => {
    if (err) {
      res.send(err);
    } else {
      res.json(id);
    }
  });
};

exports.read = (req, res) => {
  Movie.find({}, (error, movie) => {
    if (error) {
      res.send(error);
    } else {
      res.json(movie);
    }
  });
};

exports.update = (req, res) => {
  const { id } = req.params;

  Movie.findById(id, (error, movie) => {
    if (error) {
      res.send(error);
    } else {
      const tmp = Object.assign({}, movie, req.body);

      tmp.save((err, mov) => {
        if (err) {
          res.send(err);
        } else {
          res.json(mov);
        }
      });
    }
  });
};
