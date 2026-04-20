const { body, param, query } = require('express-validator');

exports.createPostRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('title is required')
    .isLength({ min: 3, max: 200 }).withMessage('title length must be 3-200 characters'),
  
  body('content')
    .trim()
    .notEmpty().withMessage('content is required')
    .isLength({ min: 10 }).withMessage('content minimum length is 10 characters'),
  
  body('author')
    .trim()
    .notEmpty().withMessage('author is required')
    .isLength({ min: 2, max: 100 }).withMessage('author length must be 2-100 characters'),
  
  body('tags')
    .optional()
    .isArray().withMessage('tags must be an array of strings'),
  
  body('tags.*')
    .optional()
    .isString().withMessage('each tag must be a string')
    .trim()
];

exports.updatePostRules = [
  param('id')
    .isMongoId().withMessage('invalid post id'),
  
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 }).withMessage('title length must be 3-200 characters'),
  
  body('content')
    .optional()
    .trim()
    .isLength({ min: 10 }).withMessage('content minimum length is 10 characters'),
  
  body('tags')
    .optional()
    .isArray().withMessage('tags must be an array of strings'),
  
  body('tags.*')
    .optional()
    .isString().withMessage('each tag must be a string')
    .trim()
];

exports.getPostsRules = [
  query('page')
    .optional()
    .toInt()
    .isInt({ min: 1 }).withMessage('page must be >= 1'),
  
  query('limit')
    .optional()
    .toInt()
    .isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100')
];

exports.searchPostsRules = [
  query('q')
    .trim()
    .notEmpty().withMessage('query parameter "q" is required')
    .isLength({ min: 2 }).withMessage('search term must be at least 2 characters')
];

exports.mongoIdParamRule = [
  param('id')
    .isMongoId().withMessage('invalid id format')
];