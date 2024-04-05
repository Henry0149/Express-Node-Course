const express = require('express');
const tourController = require('./../controllers/tour_controller');
const authController = require('./../controllers/authentication_controller');
const reviewRouter = require('./../routes/review_routes');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router.route('/stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router.route('/distance/:latlng/unit/:unit').get(tourController.getDistance);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithIn);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrict('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
