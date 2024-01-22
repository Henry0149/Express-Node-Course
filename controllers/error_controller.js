const AppError = require('../utils/app_error');

const handleJWTError = (err) => new AppError('Invalid Token', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleDuplicateFields = (err) => {
  const value = err.errmsg.match(/(['"])(\\?.)*?\1/)[0];
  const message = `Duplicate field value ${value}. please use another value`;
  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'CastError') err = handleCastError(err);
    if (err.code === 11000) err = handleDuplicateFields(err);
    if (err.name === 'JsonWebTokenError') err = handleJWTError(err);
    sendErrorProd(err, res);
  }
};
