const express = require('express');
const tourRouter = require('./routes/tour_routes');
const userRouter = require('./routes/user_routes');
const morgan = require('morgan');

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

module.exports = app;

//custom middleware
// app.use((req, res, next) => {
//   console.log('Hello from the middleware');
//   next();
// });
