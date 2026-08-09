// Catches anything thrown/rejected in route handlers. Keeps stack traces out
// of API responses (they'd leak file paths/library versions to the internet)
// while still logging them server-side for debugging.
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: status === 500 ? 'Something went wrong on our end.' : err.message,
  });
}

module.exports = { errorHandler };
