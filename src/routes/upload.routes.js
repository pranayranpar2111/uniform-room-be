const express = require('express');
const router = express.Router();
const {
  uploadImage,
  uploadImages,
  deleteImage
} = require('../controllers/upload.controller');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Upload routes (Admin only)
router.post(
  '/image',
  protect,
  authorize('admin'),
  upload.single('image'),
  uploadImage
);
router.post(
  '/images',
  protect,
  authorize('admin'),
  upload.array('images', 10),
  uploadImages
);
router.delete('/image/:publicId', protect, authorize('admin'), deleteImage);

module.exports = router;
