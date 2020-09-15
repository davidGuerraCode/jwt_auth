const express = require('express');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
require('dotenv').config();

const app = express();

// middlewares
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);

module.exports = app;
