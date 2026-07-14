const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
  }

  console.error(err.stack);

  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};

module.exports = errorMiddleware;