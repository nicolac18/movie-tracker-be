const mongoose = require('mongoose');
const querystring = require('querystring');

const httpController = require('./httpController');

const Movie = mongoose.model('Movie');

exports.getAtCinema = (req, res) => {
  const query = {
    api_key: process.env.API_KEY,
    language: process.env.LANGUAGE,
    region: process.env.REGION,
    page: req.query || 1,

    include_adult: false,
    include_video: false,
    primary_release_date: {
      lte: new Date(),
    },
    sort_by: 'release_date.desc',
    with_release_type: '3|2',
  };

  const options = {
    host: process.env.HOST_TMDB,
    method: 'GET',
    path: `/3/movie/now_playing?${querystring.stringify(query)}`,
    port: null,
    headers: {},
  };

  httpController.httpRequest(
    {}, options,
    (data) => {
      const tmp = JSON.parse(data);

      const collection = tmp.results;
      const ids = collection.map(o => o.id);

      Movie.find({ tmdb_id: { $in: ids } }, (error, movies) => {
        if (error) {
          res.error(error);
        } else {
          const moviesMap = movies.reduce((m, i) => {
            m[i.tmdb_id] = i;
            return m;
          }, {});

          const result = collection.map((o) => {
            const movie = moviesMap[o.id];

            if (movie) {
              o.watched = movie.watched;
              o.wishlist = movie.wishlist;
              return o;
            }
            return o;
          });

          res.json(result);
        }
      });
    }, (error) => {
      res.error(error);
    },
  );
};

exports.getDetails = (req, res) => {
  const query = {
    api_key: process.env.API_KEY,
    language: process.env.LANGUAGE,
    region: process.env.REGION,
  };

  const options = {
    host: process.env.HOST_TMDB,
    method: 'GET',
    path: `/3/movie/${req.params.id}?${querystring.stringify(query)}`,
    port: null,
    headers: {},
  };

  httpController.httpRequest(
    {}, options,
    (data) => {
      const collection = JSON.parse(data);

      Movie.find({ tmdb_id: req.params.id }, (error, movies) => {
        if (error) {
          res.error(error);
        } else if (movies.length === 0) {
          collection.watched = null;
          collection.wishlist = false;

          res.json(collection);
        } else {
          collection.watched = movies[0].watched;
          collection.wishlist = movies[0].wishlist;

          res.json(collection);
        }
      });
    }, (error) => {
      res.error(error);
    },
  );
};

exports.getPopular = (req, res) => {
  const query = {
    api_key: process.env.API_KEY,
    language: process.env.LANGUAGE,
    region: process.env.REGION,
    page: req.query || 1,

    include_adult: false,
    include_video: false,
    sort_by: 'popularity.desc',
  };

  const options = {
    host: process.env.HOST_TMDB,
    method: 'GET',
    path: `/3/discover/movie?${querystring.stringify(query)}`,
    port: null,
    headers: {},
  };

  httpController.httpRequest(
    {}, options,
    (data) => {
      const tmp = JSON.parse(data);

      const collection = tmp.results;
      const ids = collection.map(o => o.id);

      Movie.find({ tmdb_id: { $in: ids } }, (error, movies) => {
        if (error) {
          res.error(error);
        } else {
          const moviesMap = movies.reduce((m, i) => {
            m[i.tmdb_id] = i;
            return m;
          }, {});

          const result = collection.map((o) => {
            const movie = moviesMap[o.id];

            if (movie) {
              o.watched = movie.watched;
              o.wishlist = movie.wishlist;
              return o;
            }
            return o;
          });

          res.json(result);
        }
      });
    }, (error) => {
      res.error(error);
    },
  );
};
