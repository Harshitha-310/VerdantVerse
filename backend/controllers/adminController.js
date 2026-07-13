const Plant = require('../models/Plant');

// Create new plant (admin only)
exports.createPlant = async (req, res) => {
  try {
    const plant = await Plant.create(req.body);
    res.status(201).json({
      message: 'Plant created successfully',
      plant: plant
    });
  } catch (error) {
    console.error('Create plant error:', error);
    res.status(400).json({ 
      message: 'Error creating plant',
      error: error.message 
    });
  }
};

// Update plant (admin only)
exports.updatePlant = async (req, res) => {
  try {
    const plant = await Plant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    res.json({
      message: 'Plant updated successfully',
      plant: plant
    });
  } catch (error) {
    console.error('Update plant error:', error);
    res.status(400).json({ 
      message: 'Error updating plant',
      error: error.message 
    });
  }
};

// Delete plant (admin only) - soft delete
exports.deletePlant = async (req, res) => {
  try {
    const plant = await Plant.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    res.json({ 
      message: 'Plant deleted successfully',
      plant: {
        _id: plant._id,
        name: plant.name,
        isActive: plant.isActive
      }
    });
  } catch (error) {
    console.error('Delete plant error:', error);
    res.status(400).json({ 
      message: 'Error deleting plant',
      error: error.message 
    });
  }
};

// Restore plant (admin only)
exports.restorePlant = async (req, res) => {
  try {
    const plant = await Plant.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );

    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    res.json({ 
      message: 'Plant restored successfully',
      plant: {
        _id: plant._id,
        name: plant.name,
        isActive: plant.isActive
      }
    });
  } catch (error) {
    console.error('Restore plant error:', error);
    res.status(400).json({ 
      message: 'Error restoring plant',
      error: error.message 
    });
  }
};
// -----------------------------------------------
// Dashboard stats (Admin)
// -----------------------------------------------
exports.getDashboardStats = async (req, res) => {
  try {
    const totalPlants = await Plant.countDocuments();
    const activePlants = await Plant.countDocuments({ isActive: true });

    res.json({
      totalPlants,
      activePlants,
      message: "Dashboard stats fetched successfully"
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      message: "Error loading dashboard",
      error: error.message
    });
  }
};

// -----------------------------------------------
// Get all orders (Admin)
// -----------------------------------------------
exports.getAllOrders = async (req, res) => {
  try {
    // If you don't have an Order model yet, return placeholder
    res.json({
      message: "Orders functionality not implemented yet",
      orders: []
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      message: "Error fetching orders",
      error: error.message
    });
  }
};