const Review = require('./../models/review_model');
const catchAsync = require('./../utils/catch_async');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  res.status(200).json({
    success: true,
    result: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const newReview = await Review.create(req.body);
  res.status(201).json({
    success: true,
    data: {
      newReview,
    },
  });
});