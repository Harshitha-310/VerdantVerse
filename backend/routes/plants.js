const express = require('express');
const {
  getPlants,
  getPlant,
  getPlantsByCategory,
  updateStock,
  searchPlants,
  getFeaturedPlants
} = require('../controllers/plantController');

const {
  uploadPlantImage,
  getPlantImages,
  deletePlantImage
} = require('../controllers/uploadController');

const { protect, admin } = require('../middleware/auth');

const {
  validateStockUpdate,
  handleValidationErrors,
  validateObjectId,
  sanitizeInput
} = require('../middleware/validation');

const router = express.Router();

/* =========================================================
   PUBLIC ROUTES
   ========================================================= */
router.get('/', getPlants);                              // Get all plants
router.get('/search', searchPlants);                     // Search plants
router.get('/featured', getFeaturedPlants);              // Featured plants
router.get('/category/:category', getPlantsByCategory);  // Filter by category

/* =========================================================
   IMAGE ROUTES (ADMIN ONLY)
   ========================================================= */
router.get('/images/list', protect, admin, getPlantImages);            // List stored images
router.post('/images/upload', protect, admin, uploadPlantImage);       // Upload plant image
router.delete('/images/:filename', protect, admin, deletePlantImage);  // Delete plant image

/* =========================================================
   ADMIN ROUTES
   ========================================================= */
router.put(
  '/:id/stock',
  protect,
  admin,
  sanitizeInput,
  validateStockUpdate,
  handleValidationErrors,
  updateStock
);

/* =========================================================
   DYNAMIC ROUTE (MUST BE LAST)
   ========================================================= */
// Match ONLY valid MongoDB ObjectIDs
router.get('/:id([0-9a-fA-F]{24})', validateObjectId, getPlant);

module.exports = router;
