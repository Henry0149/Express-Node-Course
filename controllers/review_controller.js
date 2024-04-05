const Review = require('./../models/review_model');
const catchAsync = require('./../utils/catch_async');
const factory = require('./../controllers/handler_factory');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const reviews = await Review.find(filter);
  res.status(200).json({
    success: true,
    result: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
