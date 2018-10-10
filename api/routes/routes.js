const movieDatabase = require('../controllers/databaseController');
const movie = require('../controllers/movieController');
const tmdb = require('../controllers/tmdbController');

module.exports = function movieRoute(app) {
  app.options("/*", (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.send(200);
  });

  app.get('/collections/atcinema', tmdb.getAtCinema);
  app.get('/collections/popular', tmdb.getPopular);
  // app.get('/collections/watchlist', movie.getMovies);

  app.get('/discover/movies', tmdb.getMovies);

  app.route('/movies')
    .get(movie.getAll)
    .delete(movieDatabase.deleteAll)
    .post(movieDatabase.create);

  app.route('/movies/:id')
    .get(tmdb.getDetails)
    .delete(movieDatabase.delete)
    .put(movieDatabase.update);
};
