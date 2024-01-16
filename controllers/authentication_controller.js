const User = require('./../models/user_models');
const catchAsync = require('./../utils/catch_async');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    success: true,
    data: {
      user: newUser,
    },
  });
});
