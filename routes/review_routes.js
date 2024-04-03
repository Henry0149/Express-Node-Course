const reviewController = require('./../controllers/review_controller');
const express = require('express');
const authController = require('./../controllers/authentication_controller');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrict('user'),
    reviewController.createReview
  );

router.route('/:id').delete(reviewController.deleteReview);
module.exports = router;
