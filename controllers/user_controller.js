const User = require('./../models/user_models');
const APIFeatures = require('./../utils/api_features');
const catchAsync = require('./../utils/catch_async');

exports.getAllUsers = catchAsync(async (req, res) => {
  const user = new APIFeatures(User.find(), req.query);
  const allUsers = await user.query;

  res.status(200).json({
    sucess: true,
    length: user.length,
    data: {
      user: allUsers,
    },
  });
});
exports.getUser = (req, res) => {
  const user = new APIFeatures(User.find(), req.query);
  res.status(200).json({
    sucess: true,
    data: {
      user: req.body,
    },
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    sucess: false,
    message: 'This route is not yet defined',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    sucess: false,
    message: 'This route is not yet defined',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    sucess: false,
    message: 'This route is not yet defined',
  });
};
