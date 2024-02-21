const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

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
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    required: [true, 'Please Provide a password'],
    type: String,
    minlength: [10, 'Password must have a length of 10'],
    select: false,
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
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
});

userSchema.pre('save', async function (next) {
  //only run this function if the password was modified
  if (!this.isModified('password')) return next();

  //hash the password
  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changesTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changesTimeStamp;
  }
  return false;
};

userSchema.pre(/^find/, function (next) {
  //this point to current query
  this.find({ active: { $ne: false } });
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
