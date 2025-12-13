const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Please provide discount code'],
      unique: true,
      uppercase: true,
      trim: true
    },
    title: {
      type: String,
      required: [true, 'Please provide title'],
      trim: true
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot be more than 500 characters']
    },
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: [true, 'Please provide discount type']
    },
    value: {
      type: Number,
      required: [true, 'Please provide discount value'],
      min: [0, 'Value cannot be negative']
    },
    minPurchase: {
      type: Number,
      default: 0,
      min: [0, 'Minimum purchase cannot be negative']
    },
    maxDiscount: {
      type: Number,
      min: [0, 'Maximum discount cannot be negative']
    },
    usageLimit: {
      type: Number,
      required: [true, 'Please provide usage limit'],
      min: [1, 'Usage limit must be at least 1']
    },
    usedCount: {
      type: Number,
      default: 0
    },
    startDate: {
      type: Date,
      required: [true, 'Please provide start date']
    },
    endDate: {
      type: Date,
      required: [true, 'Please provide end date']
    },
    applicableProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ],
    applicableCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
      }
    ],
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

// Method to check if discount is valid
discountSchema.methods.isValid = function () {
  const now = new Date();
  return (
    this.status === 'active' &&
    this.startDate <= now &&
    this.endDate >= now &&
    this.usedCount < this.usageLimit
  );
};

module.exports = mongoose.model('Discount', discountSchema);
