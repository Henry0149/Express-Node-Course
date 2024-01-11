const express = require('express');
const tourRouter = require('./routes/tour_routes');
const userRouter = require('./routes/user_routes');
const morgan = require('morgan');
const AppError = require('./utils/app_error');
const errorFunction = require('./controllers/error_controller');

const app = express();

//3rd party middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//default middle ware
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//router handler
app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on server`, 404));
});

app.use(errorFunction);
module.exports = app;
