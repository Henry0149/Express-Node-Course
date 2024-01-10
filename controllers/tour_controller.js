const Tour = require('./../models/tour_models');
const APIFeatures = require('./../utils/api_features');

// exports.aliasTopTours = async (req, res, next) => {
//   req.query.limit = '5';
//   req.query.sort = '-ratingsAverage,price';
//   req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
//   next();
// };
exports.getAllTours = async (req, res) => {
  try {
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
  } catch (e) {
    res.status(404).json({
      success: false,
      message: e,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      succes: true,
      data: {
        tour: tour,
      },
    });
  } catch (e) {
    res.status(404).json({
      succes: false,
      message: e,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      success: true,
      data: {
        tour: newTour,
      },
    });
  } catch (e) {
    res.status(400).json({
      succes: false,
      message: e,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const updateTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      data: {
        tour: updateTour,
      },
    });
  } catch (e) {
    res.status(404).json({
      success: false,
      message: e,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
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
      // {
      //   $sort: {
      //     averagePrice: 1,
      //   },
      // },
    ]);
    res.status(200).json({
      success: true,
      data: {
        tour: stats,
      },
    });
  } catch (e) {
    res.status(404).json({
      success: false,
      message: e,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
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
  } catch (e) {
    res.status(404).json({
      success: false,
      message: e,
    });
  }
};
//filter for query
// const queryObj = { ...req.query };
// const exclude = ['page', 'sort', 'limit', 'fields'];
// exclude.forEach((el) => delete queryObj[el]);
// console.log(queryObj);
// const allTours = await Tour.find(queryObj);

//advance filtering
// let queryString = JSON.stringify(queryObj);
// queryString = queryString.replace(
//   /\b(gte|gt|lte|lt)\b/g,
//   (match) => `$${match}`
// );
// console.log(JSON.parse(queryString));

//Sorting
// let query = Tour.find(JSON.parse(queryString));
// if (req.query.sort) {
//   const sortBy = req.query.sort.spl(',').join(' ');
//   query = query.sort(sortBy);
// } else {
//   query = query.sort('-createdAt');
// }

// field limiting
// if (req.query.sort) {
//   const sortBy = req.query.sort.spl(',').join(' ');
//   query = query.sort(sortBy);
// } else {
//   query = query.sort('__v');
// }

//pagination
// const page = req.query.page * 1 || 1;
// const limit = req.query.limit * 1 || 100;
// const skip = (page - 1) * limit;
// query = query.skip(skip).limit(limit);
// if (req.query.page) {
//   const numTours = await Tour.countDocuments();
//   if (skip >= numTours) throw new Error('Page Doesnot exist');
// }
