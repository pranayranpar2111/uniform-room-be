const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
      maxlength: [200, 'Name cannot be more than 200 characters']
    },
    slug: {
      type: String,
      unique: true
    },
    sku: {
      type: String,
      required: [true, 'Please provide SKU'],
      unique: true,
      uppercase: true
    },
    description: {
      type: String,
      required: [true, 'Please provide description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters']
    },
    shortDescription: {
      type: String,
      maxlength: [500, 'Short description cannot be more than 500 characters']
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please provide category']
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    },
    price: {
      type: Number,
      required: [true, 'Please provide price'],
      min: [0, 'Price cannot be negative']
    },
    comparePrice: {
      type: Number,
      min: [0, 'Compare price cannot be negative']
    },
    costPrice: {
      type: Number,
      min: [0, 'Cost price cannot be negative']
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    lowStockThreshold: {
      type: Number,
      default: 10
    },
    images: [
      {
        url: {
          type: String,
          required: true
        },
        publicId: String,
        alt: String
      }
    ],
    colors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Color'
      }
    ],
    sizes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Size'
      }
    ],
    variants: [
      {
        color: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Color'
        },
        size: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Size'
        },
        sku: {
          type: String,
          uppercase: true
        },
        stock: {
          type: Number,
          default: 0,
          min: [0, 'Stock cannot be negative']
        }
      }
    ],
    weight: {
      type: Number,
      min: [0, 'Weight cannot be negative']
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    material: {
      type: String
    },
    careInstructions: {
      type: String
    },
    tags: [String],
    featured: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['active', 'draft', 'archived'],
      default: 'active'
    },
    views: {
      type: Number,
      default: 0
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
      },
      count: {
        type: Number,
        default: 0
      }
    },
    discount: {
      type: Number,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot be more than 100']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create slug from name
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function () {
  if (this.stock === 0) return 'Out of Stock';
  if (this.stock <= this.lowStockThreshold) return 'Low Stock';
  return 'In Stock';
});

// Virtual for discount price
productSchema.virtual('discountPrice').get(function () {
  if (this.comparePrice && this.comparePrice > this.price) {
    const discount = ((this.comparePrice - this.price) / this.comparePrice) * 100;
    return Math.round(discount);
  }
  return 0;
});

// Virtual for variant count
productSchema.virtual('variantCount').get(function () {
  return this.variants ? this.variants.length : 0;
});

// Index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
