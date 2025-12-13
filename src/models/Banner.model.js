const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide banner title'],
      trim: true
    },
    subtitle: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot be more than 500 characters']
    },
    image: {
      url: {
        type: String,
        required: [true, 'Please provide banner image']
      },
      publicId: String
    },
    link: {
      type: String,
      required: [true, 'Please provide link']
    },
    buttonText: {
      type: String,
      default: 'Shop Now'
    },
    order: {
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
    status: {
      type: String,
      enum: ['active', 'scheduled', 'inactive'],
      default: 'active'
    },
    type: {
      type: String,
      enum: ['hero', 'promotional', 'category'],
      default: 'hero'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Banner', bannerSchema);
