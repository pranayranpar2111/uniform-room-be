const Product = require('../models/Product.model');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      sort = '-createdAt',
      category,
      minPrice,
      maxPrice,
      search,
      status,
      featured
    } = req.query;

    // Build query
    const query = {};

    // Filter by category (only if valid ObjectId; ignore "undefined" string)
    const isValidObjectId = (v) => typeof v === 'string' && v.length === 24 && /^[a-fA-F0-9]+$/.test(v);
    if (category && category !== 'undefined' && isValidObjectId(category)) {
      query.category = category;
    }

    // Filter by price range (only add when values are valid numbers; never pass NaN to Mongoose)
    const minNum = minPrice !== undefined && minPrice !== null && minPrice !== '' ? Number(minPrice) : null;
    const maxNum = maxPrice !== undefined && maxPrice !== null && maxPrice !== '' ? Number(maxPrice) : null;
    const minValid = minNum !== null && Number.isFinite(minNum);
    const maxValid = maxNum !== null && Number.isFinite(maxNum);
    if (minValid || maxValid) {
      query.price = {};
      if (minValid) query.price.$gte = minNum;
      if (maxValid) query.price.$lte = maxNum;
    }

    // Filter by status
    if (status) query.status = status;

    // Filter by featured
    if (featured) query.featured = featured === 'true';

    // Search (ignore "undefined" string and empty)
    if (search && search !== 'undefined' && String(search).trim()) {
      query.$text = { $search: String(search).trim() };
    }

    // Execute query with pagination
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .populate('colors', 'name hex')
      .populate('sizes', 'name value')
      .populate({
        path: 'variants.color',
        select: 'name hex'
      })
      .populate({
        path: 'variants.size',
        select: 'name value'
      })
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Add variant count to each product
    const productsWithVariantCount = products.map(product => ({
      ...product,
      variantCount: product.variants ? product.variants.length : 0,
      totalVariantStock: product.variants 
        ? product.variants.reduce((sum, v) => sum + (v.stock || 0), 0)
        : 0
    }));

    // Get total count
    const count = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: productsWithVariantCount.length,
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: Number(page),
      data: productsWithVariantCount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug image')
      .populate('subcategory', 'name slug')
      .populate('colors', 'name hex')
      .populate('sizes', 'name value')
      .populate({
        path: 'variants.color',
        select: 'name hex'
      })
      .populate({
        path: 'variants.size',
        select: 'name value'
      });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Increment views
    product.views += 1;
    await product.save();

    // Convert to plain object and add variant count
    const productObj = product.toObject();
    productObj.variantCount = productObj.variants ? productObj.variants.length : 0;
    productObj.totalVariantStock = productObj.variants 
      ? productObj.variants.reduce((sum, v) => sum + (v.stock || 0), 0)
      : 0;

    res.status(200).json({
      success: true,
      data: productObj
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured/list
// @access  Public
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ featured: true, status: 'active' })
      .populate('category', 'name')
      .populate('colors', 'name hex')
      .limit(10)
      .lean();

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};
