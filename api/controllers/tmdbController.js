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
    headers: {
      'Content-Type': 'application/json'
    },
  };

  httpController.httpRequest(
    options,
    (error) => {
      res.status(500).send(error);
    },
    (data) => {
      let tmp;

      try {
        tmp = JSON.parse(data);
      } catch (e) {
        return res.status(500).send(e);
      }

      const collection = tmp.results;
      const ids = collection.map(o => o.id);

      Movie.find({ tmdb_id: { $in: ids } }, (error, movies) => {
        if (error) {
          res.status(500).send(error);
        } else {
          const moviesMap = movies.reduce((m, i) => {
            m[i.tmdb_id] = i;
            return m;
          }, {});

          const result = collection.map((o) => {
            const movie = moviesMap[o.id];
            o.tmdb_id = o.id;

            if (movie) {
              o.id = movie._id;
              o.watched = movie.watched;
              o.wishlist = movie.wishlist;
              return o;
            }

            delete o.id;
            return o;
          });

          res.json(result);
        }
      });
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
    options,
    (error) => {
      res.status(500).send(error);
    },
    (data) => {
      let collection;

      try {
        collection = JSON.parse(data);
      } catch (e) {
        return res.status(500).send(e);
      }

      Movie.find({ tmdb_id: req.params.id }, (error, movies) => {
        if (error) {
          res.status(500).send(error);
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
    },
  );
};

exports.getMovies = (req, res) => {
  const query = {
    api_key: process.env.API_KEY,
    language: process.env.LANGUAGE,
    region: process.env.REGION,
    'release_date.lte': req.query.release_date,
    page: req.query.page || 1,
    sort_by: req.query.sort_by || 'release_date.desc',
    year: req.query.year,

    include_adult: false,
    include_video: false,
  };

  const options = {
    host: process.env.HOST_TMDB,
    method: 'GET',
    path: `/3/discover/movie?${querystring.stringify(query)}`,
    port: null,
    headers: {
      'Content-Type': 'application/json'
    },
  };

  httpController.httpRequest(
    options,
    (error) => {
      res.status(500).send(error);
    },
    (data) => {
      let tmp;

      try {
        tmp = JSON.parse(data);
      } catch (e) {
        return res.status(500).send(e);
      }

      const collection = tmp.results;
      const totalResults = tmp.total_results;
      const ids = collection.map(o => o.id);

      Movie.find({ tmdb_id: { $in: ids } }, (error, movies) => {
        if (error) {
          res.status(500).send(error);
        } else {
          const moviesMap = movies.reduce((m, i) => {
            m[i.tmdb_id] = i;
            return m;
          }, {});

          const result = collection.map((o) => {
            const movie = moviesMap[o.id];
            o.tmdb_id = o.id;

            if (movie) {
              o.id = movie._id;
              o.watched = movie.watched;
              o.wishlist = movie.wishlist;
              return o;
            }

            delete o.id;
            return o;
          });

          res.setHeader('Total-Results', totalResults);
          res.json(result);
        }
      });
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
    headers: {
      'Content-Type': 'application/json'
    },
  };

  httpController.httpRequest(
    options,
    (error) => {
      res.status(500).send(error);
    },
    (data) => {
      let tmp;

      try {
        tmp = JSON.parse(data);
      } catch (e) {
        res.status(500);
        return res.json(e);
      }

      const collection = tmp.results;
      const ids = collection.map(o => o.id);

      Movie.find({ tmdb_id: { $in: ids } }, (error, movies) => {
        if (error) {
          res.status(500).send(error);
        } else {
          const moviesMap = movies.reduce((m, i) => {
            m[i.tmdb_id] = i;
            return m;
          }, {});

          const result = collection.map((o) => {
            const movie = moviesMap[o.id];
            o.tmdb_id = o.id;

            if (movie) {
              o.id = movie._id;
              o.watched = movie.watched;
              o.wishlist = movie.wishlist;
              return o;
            }

            delete o.id;
            return o;
          });

          res.json(result);
        }
      });
    },
  );
};

exports.search = (req, res) => {
  const query = {
    api_key: process.env.API_KEY,
    language: process.env.LANGUAGE,
    region: process.env.REGION,

    query: req.query.query,
  };

  const options = {
    host: process.env.HOST_TMDB,
    method: 'GET',
    path: `/3/search/movie?${querystring.stringify(query)}`,
    port: null,
    headers: {
      'Content-Type': 'application/json'
    },
  };

  httpController.httpRequest(
    options,
    (error) => {
      res.status(500).send(error);
    },
    (data) => {
      let tmp;

      try {
        tmp = JSON.parse(data);
      } catch (e) {
        res.status(500);
        return res.json(e);
      }

      const collection = tmp.results;
      const ids = collection.map(o => o.id);

      Movie.find({ tmdb_id: { $in: ids } }, (error, movies) => {
        if (error) {
          res.status(500).send(error);
        } else {
          const moviesMap = movies.reduce((m, i) => {
            m[i.tmdb_id] = i;
            return m;
          }, {});

          const result = collection.map((o) => {
            const movie = moviesMap[o.id];
            o.tmdb_id = o.id;

            if (movie) {
              o.id = movie._id;
              o.watched = movie.watched;
              o.wishlist = movie.wishlist;
              return o;
            }

            delete o.id;
            return o;
          });

          res.json(result);
        }
      });
    },
  );
};
