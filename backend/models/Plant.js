const mongoose = require('mongoose');

const planterSchema = new mongoose.Schema({
  name: String,
  price: Number
});

const plantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Plant name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['INDOOR PLANTS', 'FLOWERING PLANTS', 'HERBS', 'SUCCULENTS']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  careLevel: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],   // FIXED ENUM
    required: true
  },
  sunlight: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: {
    type: Number,
    default: 0
  },
  planters: [planterSchema],
  colors: [String],
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [String],
  careTips: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

plantSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Plant', plantSchema);