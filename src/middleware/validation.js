const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

const validateServicePost = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('category')
    .isIn(['Family Law', 'Business Law', 'Property Law', 'Criminal Law', 'Personal Injury', 'Other'])
    .withMessage('Invalid category'),
  handleValidationErrors
];

const validateMessage = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message content must be between 1 and 1000 characters'),
  body('receiverId')
    .isMongoId()
    .withMessage('Invalid receiver ID'),
  handleValidationErrors
];

const validateServiceRequest = [
  body('caseDetails')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Case details must be between 10 and 1000 characters'),
  body('serviceId')
    .isMongoId()
    .withMessage('Invalid service ID'),
  handleValidationErrors
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateServicePost,
  validateMessage,
  validateServiceRequest,
  handleValidationErrors
};
