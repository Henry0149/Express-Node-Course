const { promisify } = require('util');
const User = require('./../models/user_models');
const catchAsync = require('./../utils/catch_async');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/app_error');

const signToken = (id) => {
  return jwt.sign(
    {
      id: id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    photo: req.body.photo,
  });

  const token = signToken(newUser._id);
  res.status(201).json({
    success: true,
    token: token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return next(new AppError('Please Provide an email', 400));
  }
  if (!password) {
    return next(new AppError('Please Provide a Password', 400));
  }
  const user = await User.findOne({ email: email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect Email or password', 401));
  }
  const token = signToken(user._id);

  res.status(200).json({
    success: true,
    token: token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Unauthorized: Token Missing', 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError('The user belonging to this token no longer exists', 401)
    );
  }

  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changes password!', 401));
  }

  next();
});
