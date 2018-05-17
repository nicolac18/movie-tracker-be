const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const parser = require('body-parser');

const Console = require('console');

const app = express();
const port = process.env.PORT || 3000;

const Movie = require('./api/models/movieModel'); // eslint-disable-line
const Routes = require('./api/routes/routes');

dotenv.config();

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/MovieTrackerDB');

app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  next();
});

// register the routes
Routes(app);

app.use((req, res) => {
  res.status(404).send(`${req.originalUrl} not found`);
});

// start app on specific port
app.listen(port, () => {
  Console.log(`RESTful Movie Tracker API server started on: ${port}`);
});
