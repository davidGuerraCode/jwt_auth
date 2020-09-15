const { Router } = require('express');
const {
  login_get,
  signup_get,
  logout_get,
  login_post,
  signup_post,
} = require('../controllers/authController');

const router = Router();

router.get('/signup', signup_get);

router.get('/login', login_get);

router.get('/logout', logout_get);

router.post('/signup', signup_post);

router.post('/login', login_post);

module.exports = router;
