const Plant = require('../models/Plant');

// -------------------------------------------------------
// Get all plants
// -------------------------------------------------------
exports.getPlants = async (req, res) => {
  try {
    const plants = await Plant.find({ isActive: true });
    res.json(plants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------------------------------------------
// Get a single plant by ID
// -------------------------------------------------------
exports.getPlant = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);

    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    res.json(plant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------------------------------------------
// Search plants by name
// /plants/search?q=rose
// -------------------------------------------------------
exports.searchPlants = async (req, res) => {
  try {
    const query = req.query.q || "";

    const plants = await Plant.find({
      name: { $regex: query, $options: 'i' },
      isActive: true
    });

    res.json(plants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------------------------------------------
// Get featured plants (rating >= 4 and reviews >= 10)
// -------------------------------------------------------
exports.getFeaturedPlants = async (req, res) => {
  try {
    const plants = await Plant.find({
      isActive: true,
      rating: { $gte: 4 }
    }).limit(12);

    res.json(plants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------------------------------------------
// Get plants by category
// /plants/category/INDOOR PLANTS
// -------------------------------------------------------
exports.getPlantsByCategory = async (req, res) => {
  try {
    const plants = await Plant.find({
      category: req.params.category,
      isActive: true
    });

    res.json(plants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------------------------------------------
// Update stock (Admin)
// -------------------------------------------------------
exports.updateStock = async (req, res) => {
  try {
    const updatedPlant = await Plant.findByIdAndUpdate(
      req.params.id,
      { stock: req.body.stock },
      { new: true }
    );

    if (!updatedPlant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    res.json({
      message: 'Stock updated successfully',
      plant: updatedPlant
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};