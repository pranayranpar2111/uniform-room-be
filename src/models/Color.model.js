const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide color name'],
      trim: true,
      unique: true
    },
    hex: {
      type: String,
      required: [true, 'Please provide hex code'],
      match: [/^#[0-9A-F]{6}$/i, 'Please provide a valid hex color code']
    },
    image: {
      url: String,
      publicId: String
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for product count
colorSchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'colors',
  count: true
});

module.exports = mongoose.model('Color', colorSchema);
