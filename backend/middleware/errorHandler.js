const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  const status = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(status).json({ message: err.message || "Server Error" });
};

module.exports = errorHandler;
