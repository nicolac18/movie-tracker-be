const bodyParser = require('body-parser');
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const router = express.Router();

const User = mongoose.model('User');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

exports.deleteAll = (req, res) => {
  User.remove({}, (err) => {
    if (err) {
      res.sendStatus(err);
    } else {
      res.json('DELETE');
    }
  });
};

exports.getAll = (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      res.sendStatus(err);
    } else {
      res.json(users);
    }
  });
};

exports.login = (req, res) => {
  User.findOne({
    email: req.body.email
  }, (err, user) => {
    if (err) {
      res.sendStatus(err);

    } else if (!user || user.password !== req.body.password) {
      res.status(401).send({
        auth: false,
        token: null
      });

    } else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, { expiresIn: 3600 });

      res.json({
        auth: true,
        token: token
      });
    }
  });
};

exports.logout = (req, res) => {
  res.json({
    auth: false,
    token: null
  });
};

exports.register = (req, res) => {
  const tmp = {
    email: req.body.email,
    password: req.body.password
  };

  User.create(tmp, (err, user) => {
    if (err) {
      res.sendStatus(err);
    } else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, { expiresIn: 3600 });

      res.json({
        auth: true,
        token: token
      });
    }
  });
};
