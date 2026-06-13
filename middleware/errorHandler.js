const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'An unexpected error occurred';
  
  console.error('[ERROR]', {
    status: statusCode,
    message: message,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  res.status(statusCode).json({
    success: false,
    error: message,
    details: process.env.NODE_ENV === 'development' ? err.details || err.response?.data || err.stack : null,
    timestamp: new Date().toISOString()
  });
};

module.exports = errorHandler;
