const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [8, 'Minimun password length is 8 characters'],
  },
});

// fire a function after doc seved to db
userSchema.post('save', function (doc, next) {
  console.log('new user was created and save', doc);

  next();
});

// fire function before doc save to db
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();

  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method to login user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });

  if (!user) throw new Error('Incorrect email');

  const isAuth = await bcrypt.compare(password, user.password);

  if (!isAuth) throw new Error('Incorrect combination of email and password');

  return user;
};

const User = mongoose.model('user', userSchema);

module.exports = User;
