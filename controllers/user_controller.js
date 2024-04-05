const User = require('./../models/user_models');
const APIFeatures = require('./../utils/api_features');
const catchAsync = require('./../utils/catch_async');
const AppError = require('./../utils/app_error');
const factory = require('./../controllers/handler_factory');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    sucess: true,
    length: users.length,
    data: {
      users: users,
    },
  });
});
exports.getUser = (req, res) => {
  const user = new APIFeatures(User.find(), req.query);
  res.status(200).json({
    sucess: true,
    data: {
      user: user,
    },
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    sucess: false,
    message: 'This route is not yet defined',
  });
};
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        'The Route is not for password updates. Please use /updatePassword',
        400
      )
    );
  }

  const filterBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    success: true,
  });
});
