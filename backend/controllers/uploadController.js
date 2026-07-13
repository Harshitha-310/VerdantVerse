const multer = require('multer');
const path = require('path');
const fs = require('fs');

const plantStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'assets/plants/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: plantStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Upload plant image
const uploadPlantImage = (req, res) => {
  const uploadSingle = upload.single('image');

  uploadSingle(req, res, function (err) {
    if (err) {
      return res.status(400).json({ message: 'Upload failed', error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const imageUrl = `/assets/plants/${req.file.filename}`;

    res.json({
      message: 'Image uploaded successfully',
      imageUrl,
      filename: req.file.filename
    });
  });
};

// Get stored images
const getPlantImages = (req, res) => {
  const plantsDir = path.join(__dirname, '../assets/plants');

  if (!fs.existsSync(plantsDir)) {
    return res.json({ images: [] });
  }

  fs.readdir(plantsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading directory' });
    }

    const imageFiles = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => ({
        filename: file,
        url: `/assets/plants/${file}`
      }));

    res.json({ images: imageFiles });
  });
};

// Delete image
const deletePlantImage = (req, res) => {
  const { filename } = req.params;
  const imagePath = path.join(__dirname, '../assets/plants', filename);

  if (filename.includes('..') || filename.includes('/')) {
    return res.status(400).json({ message: 'Invalid filename' });
  }

  fs.unlink(imagePath, (err) => {
    if (err) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.json({ message: 'Image deleted successfully' });
  });
};

module.exports = {
  uploadPlantImage,
  getPlantImages,
  deletePlantImage
};