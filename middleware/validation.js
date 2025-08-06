const { body, validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed',
      details: errors.array() 
    });
  }
  next();
};

// Validation rules for user registration
const validateUserRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('role')
    .optional()
    .isIn(['super_admin', 'admin', 'operator', 'customer'])
    .withMessage('Invalid role specified'),
  
  handleValidationErrors
];

// Validation rules for user login
const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Validation rules for customer creation
const validateCustomerCreation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('address')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Address must be between 10 and 500 characters'),
  
  body('phone')
    .trim()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('packageId')
    .notEmpty()
    .withMessage('Package ID is required'),
  
  handleValidationErrors
];

// Validation rules for package creation
const validatePackageCreation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Package name must be between 2 and 100 characters'),
  
  body('speed')
    .isNumeric()
    .withMessage('Speed must be a number'),
  
  body('price')
    .isNumeric()
    .withMessage('Price must be a number'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  
  handleValidationErrors
];

// Validation rules for bill creation
const validateBillCreation = [
  body('customerId')
    .notEmpty()
    .withMessage('Customer ID is required'),
  
  body('packageId')
    .notEmpty()
    .withMessage('Package ID is required'),
  
  body('month')
    .isInt({ min: 1, max: 12 })
    .withMessage('Month must be between 1 and 12'),
  
  body('year')
    .isInt({ min: 2020, max: 2030 })
    .withMessage('Year must be between 2020 and 2030'),
  
  body('amount')
    .isNumeric()
    .withMessage('Amount must be a number'),
  
  body('dueDate')
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  
  handleValidationErrors
];

// Validation rules for payment creation
const validatePaymentCreation = [
  body('billId')
    .notEmpty()
    .withMessage('Bill ID is required'),
  
  body('amount')
    .isNumeric()
    .withMessage('Amount must be a number'),
  
  body('paymentDate')
    .isISO8601()
    .withMessage('Payment date must be a valid date'),
  
  body('paymentMethod')
    .isIn(['cash', 'bank_transfer', 'credit_card', 'e_wallet'])
    .withMessage('Invalid payment method'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must not exceed 500 characters'),
  
  handleValidationErrors
];

// Validation rules for package (used in packages route)
const validatePackage = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Package name must be between 2 and 100 characters'),
  
  body('speed')
    .isNumeric()
    .withMessage('Speed must be a number'),
  
  body('price')
    .isNumeric()
    .withMessage('Price must be a number'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  
  handleValidationErrors
];

// Validation rules for bill (used in bills route)
const validateBill = [
  body('customerId')
    .notEmpty()
    .withMessage('Customer ID is required'),
  
  body('packageId')
    .notEmpty()
    .withMessage('Package ID is required'),
  
  body('month')
    .isInt({ min: 1, max: 12 })
    .withMessage('Month must be between 1 and 12'),
  
  body('year')
    .isInt({ min: 2020, max: 2030 })
    .withMessage('Year must be between 2020 and 2030'),
  
  body('amount')
    .isNumeric()
    .withMessage('Amount must be a number'),
  
  body('dueDate')
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  
  body('status')
    .optional()
    .isIn(['pending', 'paid', 'overdue', 'cancelled'])
    .withMessage('Status must be pending, paid, overdue, or cancelled'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must not exceed 500 characters'),
  
  handleValidationErrors
];

// Validation rules for payment (used in payments route)
const validatePayment = [
  body('billId')
    .notEmpty()
    .withMessage('Bill ID is required'),
  
  body('customerId')
    .notEmpty()
    .withMessage('Customer ID is required'),
  
  body('amount')
    .isNumeric()
    .withMessage('Amount must be a number'),
  
  body('paymentMethod')
    .isIn(['cash', 'bank_transfer', 'credit_card', 'e_wallet'])
    .withMessage('Invalid payment method'),
  
  body('paymentDate')
    .optional()
    .isISO8601()
    .withMessage('Payment date must be a valid date'),
  
  body('status')
    .optional()
    .isIn(['pending', 'completed', 'failed', 'cancelled'])
    .withMessage('Status must be pending, completed, failed, or cancelled'),
  
  body('reference')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Reference must not exceed 100 characters'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must not exceed 500 characters'),
  
  handleValidationErrors
];

// Validation rules for user update
const validateUserUpdate = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('role')
    .optional()
    .isIn(['super_admin', 'admin', 'operator', 'customer'])
    .withMessage('Invalid role specified'),
  
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be either active or inactive'),
  
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validateCustomerCreation,
  validatePackageCreation,
  validateBillCreation,
  validatePaymentCreation,
  validateUserUpdate,
  validatePackage,
  validateBill,
  validatePayment
}; 