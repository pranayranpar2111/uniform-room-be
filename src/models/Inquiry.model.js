const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    phone: {
      type: String,
      trim: true
    },
    subject: {
      type: String,
      required: [true, 'Please provide subject'],
      trim: true,
      maxlength: [200, 'Subject cannot be more than 200 characters']
    },
    message: {
      type: String,
      required: [true, 'Please provide message'],
      maxlength: [2000, 'Message cannot be more than 2000 characters']
    },
    category: {
      type: String,
      enum: [
        'Product Inquiry',
        'Bulk Order',
        'Shipping',
        'Returns',
        'Customization',
        'Size Guide',
        'General',
        'Other'
      ],
      default: 'General'
    },
    status: {
      type: String,
      enum: ['new', 'in-progress', 'replied', 'archived'],
      default: 'new'
    },
    reply: {
      message: String,
      repliedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      repliedAt: Date
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
