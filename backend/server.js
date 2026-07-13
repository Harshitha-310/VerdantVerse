const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const aiRoutes = require("./routes/ai");



const app = express();

// Middleware
app.use(cors());
app.use(express.json());



// Serve static files - BOTH assets and uploads
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/greenleaf', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/plants', require('./routes/plants'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));
app.use("/api/ai", aiRoutes);


// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    message: 'Green Leaf Backend is running!',
    timestamp: new Date().toISOString(),
    database: db.readyState === 1 ? 'Connected' : 'Disconnected',
    staticRoutes: {
      assets: '/assets',
      uploads: '/uploads'
    }
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Green Leaf API Server',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      plants: '/api/plants',
      orders: '/api/orders',
      admin: '/api/admin'
    },
    staticFiles: {
      plantImages: '/assets/plants/',
      userUploads: '/uploads/'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📍 API Base: http://localhost:${PORT}/api`);
  console.log(`📍 Plant Images: http://localhost:${PORT}/assets/plants/`);
});
