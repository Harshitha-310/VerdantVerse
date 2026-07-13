// backend/middleware/validation.js
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

/**
 * Simple validation for registration:
 * - name: required, letters and spaces, 2-50 chars
 * - email: must be valid and unique
 * - password: required (no character restrictions)
 * - confirmPassword: must match password
 */
const validateRegistration = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),

  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new Error('Email is already registered');
      }
      return true;
    }),

  // Password: only requirement is that it exists and has minimum length
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 1 })
    .withMessage('Password is required'),

  // Confirm password should match password
  body('confirmPassword')
    .custom((value, { req }) => {
      // If confirmPassword is provided, enforce match. If you want it optional -> remove this block.
      if (req.body.password !== undefined) {
        if (!value) {
          throw new Error('Please confirm your password');
        }
        if (value !== req.body.password) {
          throw new Error('Passwords do not match');
        }
      }
      return true;
    })
];

/**
 * Login validation: require email + password
 */
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

/**
 * Plants, orders, billing etc — kept largely the same but you can simplify
 * or remove validators you don't use. These are included so existing route
 * imports continue to work.
 */

const validatePlant = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Plant name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Plant name must be between 2 and 100 characters'),

  body('category')
    .isIn(['INDOOR PLANTS', 'FLOWERING PLANTS', 'HERBS', 'SUCCULENTS'])
    .withMessage('Invalid plant category'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),

  body('careLevel')
    .isIn(['Easy', 'Moderate', 'Difficult'])
    .withMessage('Invalid care level'),

  body('sunlight')
    .trim()
    .notEmpty()
    .withMessage('Sunlight requirement is required'),

  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  body('originalPrice')
    .isFloat({ min: 0 })
    .withMessage('Original price must be a positive number'),

  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer')
];

const validateOrder = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),

  body('items.*.plant')
    .isMongoId()
    .withMessage('Invalid plant ID'),

  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),

  body('items.*.price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  body('shippingAddress.firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),

  body('shippingAddress.lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),

  body('shippingAddress.email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('shippingAddress.phone')
    .matches(/^\d{10}$/)
    .withMessage('Phone number must be 10 digits'),

  body('shippingAddress.address')
    .trim()
    .notEmpty()
    .withMessage('Address is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Address must be between 5 and 200 characters'),

  body('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),

  body('shippingAddress.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),

  body('shippingAddress.pinCode')
    .matches(/^\d{6}$/)
    .withMessage('PIN code must be 6 digits'),

  body('paymentMethod')
    .isIn(['razorpay', 'card', 'upi'])
    .withMessage('Invalid payment method')
];

const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),

  body('phone')
    .optional()
    .matches(/^\d{10}$/)
    .withMessage('Phone number must be 10 digits'),

  body('address.street')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Street address too long'),

  body('address.city')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('City name too long'),

  body('address.state')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('State name too long'),

  body('address.pinCode')
    .optional()
    .matches(/^\d{6}$/)
    .withMessage('PIN code must be 6 digits')
];

const validateBilling = [
  body('cardNumber')
    .matches(/^\d{16}$/)
    .withMessage('Card number must be 16 digits'),

  body('cardHolder')
    .trim()
    .notEmpty()
    .withMessage('Card holder name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Card holder name must be between 2 and 50 characters'),

  body('expiryMonth')
    .isInt({ min: 1, max: 12 })
    .withMessage('Expiry month must be between 1 and 12'),

  body('expiryYear')
    .isInt({ min: new Date().getFullYear(), max: new Date().getFullYear() + 10 })
    .withMessage('Invalid expiry year'),

  body('cvv')
    .matches(/^\d{3,4}$/)
    .withMessage('CVV must be 3 or 4 digits')
];

const validateStockUpdate = [
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer')
];

const validateOrderStatus = [
  body('status')
    .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status')
];

// Middleware to check for validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
  }
  next();
};

// Sanitization middleware - NOTE: we avoid escaping passwords
const sanitizeInput = [
  // Only escape fields that are user-visible, NOT passwords
  body('name').optional().trim().escape(),
  body('email').optional().normalizeEmail(),
  body('description').optional().trim().escape()
];

// Validate MongoDB ID parameter
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validatePlant,
  validateOrder,
  validateProfileUpdate,
  validateBilling,
  validateStockUpdate,
  validateOrderStatus,
  handleValidationErrors,
  sanitizeInput,
  validateObjectId
};