const express = require('express');
const userController = require('./../controllers/user_controller');

const userRouter = express.Router();

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
