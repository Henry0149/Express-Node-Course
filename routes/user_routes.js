const express = require('express');
const userController = require('./../controllers/user_controller');
const authController = require('./../controllers/authentication_controller');

const userRouter = express.Router();

userRouter.post('/signup', authController.signup);
userRouter.post('/signin', authController.login);
userRouter.post('/forgetPassword', authController.forgetPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);
userRouter.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);

userRouter.patch('/updateMe', authController.protect, userController.updateMe);
userRouter.delete('/deleteMe', authController.protect, userController.deleteMe);

userRouter
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
userRouter
  .route('/:id')
  .get(userController.getUser)
  .post(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = userRouter;
