const express = require('express');
const tourRouter = require('./routes/tour_routes');
const userRouter = require('./routes/user_routes');
const morgan = require('morgan');
const AppError = require('./utils/app_error');
const errorFunction = require('./controllers/error_controller');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
// const xss = require('xss-clean');

const app = express();

//HTTP security headers
app.use(helmet());

//3rd party middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Rate Limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again later',
});

app.use('/api', limiter);

//default middle ware/Body parser and date limiter
app.use(express.json({ limit: '10Kb' }));
//data sanitization
app.use(mongoSanitize());
// prevention against cross scripting attack
// app.use(xss());

app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//router handler
app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on server`, 404));
});

app.use(errorFunction);
module.exports = app;
