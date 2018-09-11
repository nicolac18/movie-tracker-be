const mongoose = require('mongoose');

const Movie = mongoose.model('Movie');

exports.create = (req, res) => {
  const mov = new Movie(req.body);

  if (!mov.watched && !mov.wishlist) {
    mov.wishlist = true;
  }

  mov.save((err, movie) => {
    if (err) {
      res.sendStatus(err);
    } else {
      res.json(movie);
    }
  });
};

exports.delete = (req, res) => {
  const { id } = req.params;

  Movie.remove({ _id: id }, (err) => {
    if (err) {
      res.sendStatus(err);
    } else {
      res.json(id);
    }
  });
};

exports.deleteAll = (req, res) => {
  Movie.remove({ }, (err) => {
    if (err) {
      res.sendStatus(err);
    } else {
      res.json('DELETE');
    }
  });
};

exports.read = (req, res) => {
  Movie.find({}, (error, movie) => {
    if (error) {
      res.sendStatus(error);
    } else {
      movie.tmdb_id = movie.id;
      movie.id = movie._id;

      res.json(movie);
    }
  });
};

exports.update = (req, res) => {
  const { id } = req.params;

  req.body.updated_at = new Date();
  Movie.findOneAndUpdate(id, req.body, { new: true }, (error, movie) => {
    if (error) {
      res.sendStatus(error);
    } else {
      movie.tmdb_id = movie.id;
      movie.id = movie._id;

      res.json(movie);
    }
  });
};
