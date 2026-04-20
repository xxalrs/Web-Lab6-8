const { validationResult } = require('express-validator');
const ApiError = require('../errors/ApiError');

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(e => ({ field: e.path, msg: e.msg }));
    const apiError = ApiError.badRequest('Validation error', formattedErrors);
    return next(apiError);
  }
  next();
};