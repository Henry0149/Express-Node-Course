const catchAsync = require('./../utils/catch_async');
const AppError = require('./../utils/app_error');

exports.deleteOne = (Model) =>
  (exports.deleteTour = catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(204).json({
      status: 'success',
      message: 'Tour Deleted Successfully',
      data: null,
    });
  }));

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document Found with that ID', 404));
    }
    res.status(200).json({
      success: true,
      data: {
        doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);

    res.status(201).json({
      success: true,
      data: {
        data: newDoc,
      },
    });
  });
