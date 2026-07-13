const express = require('express');
const { getDashboardStats, getAllOrders, createPlant, updatePlant, deletePlant } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');
const { 
  validatePlant, 
  handleValidationErrors, 
  validateObjectId,
  sanitizeInput 
} = require('../middleware/validation');

const router = express.Router();

router.use(protect, admin);

router.get('/dashboard', getDashboardStats);
router.get('/orders', getAllOrders);
router.post('/plants', sanitizeInput, validatePlant, handleValidationErrors, createPlant);
router.put('/plants/:id', validateObjectId, sanitizeInput, validatePlant, handleValidationErrors, updatePlant);
router.delete('/plants/:id', validateObjectId, deletePlant);

module.exports = router;