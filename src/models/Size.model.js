const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide size name'],
      trim: true,
      unique: true
    },
    value: {
      type: String,
      required: [true, 'Please provide size value']
    },
    category: {
      type: String,
      required: [true, 'Please provide size category'],
      enum: ['General', 'Pants', 'Shoes', 'Kids', 'Other']
    },
    order: {
      type: Number,
      default: 0
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
sizeSchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'sizes',
  count: true
});

module.exports = mongoose.model('Size', sizeSchema);
