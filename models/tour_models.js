const mongoose = require('mongoose');
// const { default: slugify } = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A Tour Must Have a Name'],
      unique: true,
      trim: true,
      maxlength: [40, 'Max length must be of 40 characters'],
      minlength: [10, 'Min length must be of 10 characters'],
      //validate: [validator.isAlpha, 'Tour Name must be String'],
    },
    duration: {
      type: Number,
      required: [true, 'A Tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must greater or equal to 1'],
      max: [5, 'Rating must lesser or equal to 5'],
    },
    price: { type: Number, required: [true, 'A Tour Must Have a price'] },
    discount: {
      type: Number,
      validate: {
        validator: function (val) {
          //'this' object will not work on the update function
          //'this' only points to current docs on a NEW document
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) must be less than the actual price',
      },
    },
    summary: {
      type: String,
      required: [true, 'A Tour must have a description'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover message'],
    },
    slug: String,
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//Document Middleware: runs before .save() and .created()
// tourSchema.pre('save', function (next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

//Aggregate Middleware
// tourSchema.pre('aggregate', function (next) {
//   console.log(this.pipeline());
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
