const mongoose = require('mongoose');
const Plant = require('./models/Plant');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const assetsPath = path.join(__dirname, 'assets', 'plants');
const hasLocalAssets = fs.existsSync(assetsPath);

const img = (file) =>
  hasLocalAssets ? `/assets/plants/${file}` : `https://placeholder.com/${file}`;

const samplePlants = [
  {
    name: "African Violet",
    category: "INDOOR PLANTS",
    description: "A beautiful blooming indoor plant with purple flowers.",
    careLevel: "Medium",
    sunlight: "Indirect Light",
    price: 299,
    originalPrice: 399,
    image: img("african-violet.jpg"),
    rating: 4.6,
    reviews: 112,
    planters: [{ name: "Classic", price: 199 }],
    colors: ["Purple", "Green"],
    stock: 20,
    tags: ["flowering"],
    isActive: true,
  },
  {
    name: "Aloe Vera",
    category: "INDOOR PLANTS",
    description: "Low-maintenance succulent with healing properties.",
    careLevel: "Easy",
    sunlight: "Bright Indirect",
    price: 249,
    originalPrice: 349,
    image: img("aloe-vera.jpg"),
    rating: 4.8,
    reviews: 150,
    planters: [{ name: "Basic", price: 199 }],
    colors: ["Green"],
    stock: 30,
    tags: ["succulent", "low-maintenance"],
    isActive: true,
  },
  {
    name: "Basil",
    category: "HERBS",
    description: "Aromatic herb perfect for home cooking.",
    careLevel: "Easy",
    sunlight: "Full Sun",
    price: 199,
    originalPrice: 249,
    image: img("basil.jpg"),
    rating: 4.5,
    reviews: 90,
    planters: [{ name: "Grow Pot", price: 99 }],
    colors: ["Green"],
    stock: 25,
    tags: ["herb", "kitchen"],
    isActive: true,
  },
  {
    name: "Cactus",
    category: "INDOOR PLANTS",
    description: "Hardy cactus requiring minimal watering.",
    careLevel: "Easy",
    sunlight: "Bright Light",
    price: 199,
    originalPrice: 299,
    image: img("cactus.jpg"),
    rating: 4.7,
    reviews: 80,
    planters: [{ name: "Desert Pot", price: 149 }],
    colors: ["Green"],
    stock: 18,
    tags: ["succulent", "low-maintenance"],
    isActive: true,
  },
  {
    name: "Fern",
    category: "INDOOR PLANTS",
    description: "Lush indoor plant that thrives in humidity.",
    careLevel: "Medium",
    sunlight: "Low to Medium",
    price: 349,
    originalPrice: 449,
    image: img("fern.jpg"),
    rating: 4.6,
    reviews: 140,
    planters: [{ name: "Hanging Pot", price: 299 }],
    colors: ["Green"],
    stock: 22,
    tags: ["bushy"],
    isActive: true,
  },
  {
    name: "Fiddle Leaf Fig",
    category: "INDOOR PLANTS",
    description: "Popular indoor plant with large glossy leaves.",
    careLevel: "Medium",
    sunlight: "Bright Indirect",
    price: 799,
    originalPrice: 999,
    image: img("fiddle-leaf.jpg"),
    rating: 4.7,
    reviews: 190,
    planters: [{ name: "Premium", price: 399 }],
    colors: ["Green"],
    stock: 10,
    tags: ["big-plant"],
    isActive: true,
  },
  {
    name: "Jade Plant",
    category: "INDOOR PLANTS",
    description: "A lucky succulent known for prosperity.",
    careLevel: "Easy",
    sunlight: "Bright Light",
    price: 349,
    originalPrice: 449,
    image: img("jade.jpg"),
    rating: 4.6,
    reviews: 110,
    planters: [{ name: "Small Pot", price: 199 }],
    colors: ["Green"],
    stock: 28,
    tags: ["succulent", "lucky"],
    isActive: true,
  },
  {
    name: "Lavender",
    category: "HERBS",
    description: "Fragrant herb known for relaxation.",
    careLevel: "Medium",
    sunlight: "Full Sun",
    price: 399,
    originalPrice: 499,
    image: img("lavender.jpg"),
    rating: 4.8,
    reviews: 200,
    planters: [{ name: "Rustic Pot", price: 249 }],
    colors: ["Purple", "Green"],
    stock: 17,
    tags: ["fragrant"],
    isActive: true,
  },
  {
    name: "Mint",
    category: "HERBS",
    description: "Fast-growing herb perfect for teas & drinks.",
    careLevel: "Easy",
    sunlight: "Partial Sun",
    price: 199,
    originalPrice: 249,
    image: img("mint.jpg"),
    rating: 4.5,
    reviews: 95,
    planters: [{ name: "Grow Pot", price: 99 }],
    colors: ["Green"],
    stock: 40,
    tags: ["herb", "refreshing"],
    isActive: true,
  },
  {
    name: "Monstera",
    category: "INDOOR PLANTS",
    description: "Trendy plant with iconic split leaves.",
    careLevel: "Easy",
    sunlight: "Medium Indirect",
    price: 999,
    originalPrice: 1299,
    image: img("monstera.jpg"),
    rating: 4.9,
    reviews: 245,
    planters: [{ name: "Premium", price: 399 }],
    colors: ["Green"],
    stock: 12,
    tags: ["aesthetic"],
    isActive: true,
  },
  {
    name: "Orchid",
    category: "FLOWERING PLANTS",
    description: "Elegant flowering plant that adds luxury.",
    careLevel: "Medium",
    sunlight: "Indirect",
    price: 799,
    originalPrice: 999,
    image: img("orchid.jpg"),
    rating: 4.8,
    reviews: 180,
    planters: [{ name: "Glass Pot", price: 299 }],
    colors: ["Pink", "White"],
    stock: 14,
    tags: ["flowering"],
    isActive: true,
  },
  {
    name: "Peace Lily",
    category: "INDOOR PLANTS",
    description: "Beautiful flowering plant that purifies air.",
    careLevel: "Easy",
    sunlight: "Medium Indirect",
    price: 599,
    originalPrice: 799,
    image: img("peace-lily.jpg"),
    rating: 4.7,
    reviews: 120,
    planters: [{ name: "Basic", price: 199 }],
    colors: ["White", "Green"],
    stock: 15,
    tags: ["flowering", "air-purifier"],
    isActive: true,
  },
  {
    name: "Pothos",
    category: "INDOOR PLANTS",
    description: "One of the easiest indoor vines to care for.",
    careLevel: "Easy",
    sunlight: "Low to Bright",
    price: 249,
    originalPrice: 349,
    image: img("pothos.jpg"),
    rating: 4.8,
    reviews: 165,
    planters: [{ name: "Hanging Pot", price: 249 }],
    colors: ["Green"],
    stock: 30,
    tags: ["vining", "low-maintenance"],
    isActive: true,
  },
  {
    name: "Rose Plant",
    category: "FLOWERING PLANTS",
    description: "A classic flowering plant with beautiful blooms.",
    careLevel: "Medium",
    sunlight: "Full Sun",
    price: 499,
    originalPrice: 699,
    image: img("rose.jpg"),
    rating: 4.7,
    reviews: 210,
    planters: [{ name: "Terracotta", price: 199 }],
    colors: ["Red", "Green"],
    stock: 18,
    tags: ["flowering"],
    isActive: true,
  },
  {
    name: "Rosemary",
    category: "HERBS",
    description: "Fragrant herb perfect for cooking.",
    careLevel: "Easy",
    sunlight: "Full Sun",
    price: 249,
    originalPrice: 349,
    image: img("rosemary.jpg"),
    rating: 4.6,
    reviews: 130,
    planters: [{ name: "Grow Pot", price: 99 }],
    colors: ["Green"],
    stock: 26,
    tags: ["herb"],
    isActive: true,
  },
  {
    name: "Snake Plant",
    category: "INDOOR PLANTS",
    description: "Excellent air purifier, requires minimal care.",
    careLevel: "Easy",
    sunlight: "Low to Bright",
    price: 299,
    originalPrice: 399,
    image: img("snake-plant.jpg"),
    rating: 4.8,
    reviews: 169,
    planters: [
      { name: "GroPot", price: 299 },
      { name: "Krish", price: 349 },
      { name: "Kyoto", price: 349 }
    ],
    colors: ["Ivory", "Green", "White"],
    stock: 25,
    tags: ["air-purifier", "beginner-friendly"],
    isActive: true
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/greenleaf');
    console.log('✅ Connected to MongoDB');

    if (hasLocalAssets) {
      console.log('📁 Using local assets from backend/assets/plants/');
    } else {
      console.log('🌐 Using external image URLs (no local assets found)');
    }

    await Plant.deleteMany({});
    console.log('♻ Cleared existing plants');

    await Plant.insertMany(samplePlants);
    console.log('🌱 Sample plants inserted');

    const total = await Plant.countDocuments();
    console.log(`📊 Total plants in database: ${total}`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding:', err);
    process.exit(1);
  }
};

seedDatabase();
