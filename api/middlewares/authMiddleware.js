var jwt = require('jsonwebtoken');

exports.checkToken = (req, res, next) => {
  const token = req.headers['authorization'].replace('Bearer ', '');

  if (!token) {
    res.status(403).send({
      auth: false,
      message: 'No token provided.'
    });

  } else {
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        res.status(403).send({
          auth: false,
          message: 'Failed to authenticate token.'
        })
      } else {
        req.user = decoded.id;
        next();
      }
    })
  }
};
