const authentication = require('../controllers/authController');
const authenticationMiddleware = require('../middlewares/authMiddleware');
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

  app.post('/auth/login', authentication.login)
  app.get('/auth/logout', authentication.logout)

  app.route('/auth/register')
    .get(authentication.getAll)
    .delete(authentication.deleteAll)
    .post(authentication.register)

  // add token verify on each call
  app.use(authenticationMiddleware.checkToken);

  app.get('/collections/atcinema', tmdb.getAtCinema);
  app.get('/collections/popular', tmdb.getPopular);

  app.get('/discover/movies', tmdb.getMovies);

  app.get('/movies/search', tmdb.search);

  app.route('/movies')
    .get(movie.getAll)
    .delete(movieDatabase.deleteAll)
    .post(movieDatabase.create);

  app.route('/movies/:id')
    .get(tmdb.getDetails)
    .delete(movieDatabase.delete)
    .put(movieDatabase.update);
};
