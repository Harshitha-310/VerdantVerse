// routes/auth.js
const express = require('express');
const {
  register,
  login,
  getProfile,
  updateProfile
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');
const {
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
  handleValidationErrors,
  sanitizeInput
} = require('../middleware/validation');

const router = express.Router();

/**
 * Middleware: log the request body for debugging the register/login payload.
 * Keeps logs minimal but useful to see what the frontend actually sent.
 */
function logRequestBody(req, res, next) {
  // Only log for register/login endpoints to avoid noisy logs on every route.
  if (req.path === '/register' || req.path === '/login') {
    console.log(`[auth] ${req.method} ${req.originalUrl} payload:`, req.body);
  }
  next();
}

/**
 * Optional middleware: add defaults or rename fields if needed.
 * WARNING: Mutating request payload can hide frontend bugs.
 * If your front-end is missing role or confirmPassword and you want backend
 * to automatically provide them (not recommended), uncomment and adapt below.
 */
/*
function addDefaultsToRegister(req, res, next) {
  if (req.path === '/register') {
    // Example: if backend requires role and frontend doesn't send it:
    if (!req.body.role) {
      req.body.role = 'user'; // default role
    }
    // Example: if backend requires confirmPassword and frontend didn't send it,
    // you could copy from password (not recommended if you want proper confirmation):
    // if (!req.body.confirmPassword && req.body.password) {
    //   req.body.confirmPassword = req.body.password;
    // }
  }
  next();
}
*/

// Apply logging middleware to routes in this router
router.use(logRequestBody);

// Register route
// Note: sanitizeInput -> validateRegistration -> handleValidationErrors -> register
router.post(
  '/register',
  sanitizeInput,
  // addDefaultsToRegister, // <--- (optional) uncomment if you decide to auto-fill defaults
  validateRegistration,
  handleValidationErrors,
  register
);

// Login route
router.post('/login', sanitizeInput, validateLogin, handleValidationErrors, login);

// Profile routes (protected)
router.get('/profile', protect, getProfile);
router.put(
  '/profile',
  protect,
  sanitizeInput,
  validateProfileUpdate,
  handleValidationErrors,
  updateProfile
);

module.exports = router;