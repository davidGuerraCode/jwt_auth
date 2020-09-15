const User = require('../models/User');
const jwt = require('jsonwebtoken');

const handleErrors = (err) => {
  let errors = { email: '', password: '' };

  if (err.message === 'Incorrect email')
    errors.email = 'The email is not registered';

  if (err.message === 'Incorrect combination of email and password')
    errors.password = 'The password is incorrect';

  if (err.code === 11000) {
    errors.email = 'That email is already registered';

    return errors;
  }

  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const MAX_AGE = 3 * 24 * 60 * 60; // 3 dias en segundos

// jwt.sign([payload], [signature], [options]);
const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET_KEY, { expiresIn: MAX_AGE });
};

const signup_get = (req, res) => {
  res.render('signup');
};

const login_get = (req, res) => {
  res.render('login');
};

const logout_get = (req, res) => {
  // Un token no puede ser eliminado como tal, solo se reemplaza
  // por uno nuevo con el mismo nombre, vacio y con un tiempo
  // de vida super corto.
  res.cookie('jwt', '', { maxAge: 1 });
  res.status(301).redirect('/');
};

const signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const newUser = await User.create({ email, password });
    const token = createToken(newUser._id);

    res.cookie('jwt', token, { httpOnly: true, maxAge: MAX_AGE * 1000 });
    res.status(201).json({ user: newUser._id });
  } catch (err) {
    const error = handleErrors(err);

    res.status(400).json({ error });
  }
};
const login_post = async (req, res) => {
  const { email, password } = req.body;

  // Consultar si el usuario existe en BD.
  // Decodificar el password.
  // Comparar el password enviado en la peticion con el del usuario que se intenta logear.
  // Si el password es el correcto, crear un nuevo token para el usuario ahora autenticado.
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);

    // Responder la peticion con la nueva cookie de usuario autorizado.
    res.cookie('jwt', token, { httpOnly: true, maxAge: MAX_AGE * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const error = handleErrors(err);

    res.status(400).json({ error });
  }
};

module.exports = {
  signup_get,
  login_get,
  logout_get,
  signup_post,
  login_post,
};
