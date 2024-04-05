const AppError = require('../utils/app_error');
const Tour = require('./../models/tour_models');
const APIFeatures = require('./../utils/api_features');
const catchAsync = require('./../utils/catch_async');
const factory = require('./../controllers/handler_factory');

exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();
  const allTours = await features.query;

  res.status(200).json({
    success: true,
    result: allTours.length,
    data: { allTours },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate('reviews');
  if (!tour) {
    return next(new AppError('No Tour Found with that ID', 404));
  }
  res.status(200).json({
    success: true,
    data: {
      tour: tour,
    },
  });
  next();
});

exports.createTour = factory.createOne(Tour);

exports.updateTour = factory.updateOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: {
        rating: { $gte: 4.5 },
      },
    },
    {
      $group: {
        _id: null,
        num: { $sum: 1 },
        numRatings: { $sum: '$rating' },
        averageRating: { $avg: '$rating' },
        averagePrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
  ]);
  res.status(200).json({
    success: true,
    data: {
      tour: stats,
    },
  });
});
exports.deleteTour = factory.deleteOne(Tour);

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numTourStarts: -1,
      },
    },
  ]);
  res.status(200).json({
    success: true,
    data: { plan },
  });
});

exports.getToursWithIn = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;

  const [lat, lng] = latlng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(new AppError('Please provide latlng in the correct format'), 400);
  }

  const tour = await Tour.find({
    startLocation: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] },
    },
  });
  console.log(distance, lat, lng, unit);

  res.status(200).json({
    success: true,
    results: tour.length,
    data: tour,
  });
});

exports.getDistance = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  if (!lat || !lng) {
    console.log('Error on Apperror');
    return next(
      new AppError('Please provide latlng in the correct format'),
      400
    );
  }
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  const distance = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);
  console.log(distance);

  res.status(200).json({
    success: true,
    data: { distance },
  });
});
