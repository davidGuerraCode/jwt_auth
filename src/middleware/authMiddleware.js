const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) res.redirect('/login');

  jwt.verify(token, process.env.TOKEN_SECRET_KEY, (error, decodedToken) => {
    if (error) {
      console.log(error.message);
      res.redirect('/login');
    } else {
      console.log(decodedToken);
      next();
    }
  });
};

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    res.locals.user = null;
    next();
  }
  // jwt.verify(token, sercretKey, cb);
  jwt.verify(
    token,
    process.env.TOKEN_SECRET_KEY,
    async (error, decodedToken) => {
      if (error) {
        console.log(error.message);
        res.locals.user = null;
        next();
      } else {
        const user = await User.findById(decodedToken.id);

        res.locals.user = user;
        next();
      }
    }
  );
};

module.exports = { requireAuth, checkUser };
