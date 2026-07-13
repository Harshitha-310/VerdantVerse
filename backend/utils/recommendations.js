const Plant = require('../models/Plant');

// AI-based plant recommendations
exports.getPlantRecommendations = async (userId, userPreferences = {}) => {
  try {
    const { sunlight = 'medium', careLevel = 'easy', category = 'INDOOR PLANTS' } = userPreferences;

    let query = {
      isActive: true,
      stock: { $gt: 0 }
    };

    // Basic recommendation based on preferences
    if (sunlight) {
      query.sunlight = { $regex: sunlight, $options: 'i' };
    }

    if (careLevel) {
      query.careLevel = careLevel;
    }

    if (category && category !== 'ALL') {
      query.category = category;
    }

    const recommendations = await Plant.find(query)
      .sort({ rating: -1, reviews: -1 })
      .limit(6);

    return recommendations;
  } catch (error) {
    console.error('Recommendation error:', error);
    return [];
  }
};

// Get trending plants
exports.getTrendingPlants = async () => {
  try {
    const trending = await Plant.find({ isActive: true, stock: { $gt: 0 } })
      .sort({ rating: -1, reviews: -1 })
      .limit(8);

    return trending;
  } catch (error) {
    console.error('Trending plants error:', error);
    return [];
  }
};