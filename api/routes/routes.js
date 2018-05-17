const movieDatabase = require('../controllers/databaseController');
const tmdb = require('../controllers/tmdbController');

module.exports = function movieRoute(app) {
  app.get('/collections/atcinema', tmdb.getAtCinema);
  app.get('/collections/popular', tmdb.getPopular);

  app.route('/movies')
    .post(movieDatabase.create);

  app.route('/movies/:id')
    .get(tmdb.getDetails)
    .delete(movieDatabase.delete)
    .put(movieDatabase.update);
};
