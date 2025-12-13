const mongoose = require('mongoose');

const sizeChartSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide size chart name'],
      trim: true,
      unique: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please provide category']
    },
    measurements: [
      {
        name: {
          type: String,
          required: true
        },
        unit: {
          type: String,
          default: 'inches'
        },
        description: String
      }
    ],
    sizes: [
      {
        size: {
          type: String,
          required: true
        },
        measurements: {
          type: Map,
          of: String
        }
      }
    ],
    howToMeasure: [
      {
        measurement: String,
        instruction: String
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

module.exports = mongoose.model('SizeChart', sizeChartSchema);
