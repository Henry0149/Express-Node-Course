const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User Must Have a Name'],
    trim: true,
    maxlength: [20, 'Max length must be of 40 characters'],
    minlength: [8, 'Min length must be of 10 characters'],
  },
  email: {
    type: String,
    required: [true, 'Use must have an email'],
    unique: true,
    validate: [validator.isEmail, 'Invalid email'],
  },
  photo: {
    type: String,
  },
  password: {
    required: [true, 'Please Provide a password'],
    type: String,
    minlength: [10, 'Password must have a length of 10'],
  },
  confirmPassword: {
    required: [true, 'Please Confirm your password'],
    type: String,
    minlength: [10, 'Password must have a length of 10'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
    },
  },
});

userSchema.pre('save', async function (next) {
  //only run this function if the password was modified
  if (!this.isModified('password')) return next();

  //hash the password
  this.password = await bcrypt.hash(this.password, 12);

  //deletes the user
  this.confirmPassword = undefined;
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
