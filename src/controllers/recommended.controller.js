const Product = require('../models/Product.model');

// @desc    Get recommended products for a section
// @route   GET /api/recommended/:section
// @access  Public
exports.getRecommendedBySection = async (req, res, next) => {
  try {
    const { section } = req.params;
    const { limit = 10 } = req.query;

    let query = { status: 'active' };
    let sort = '-createdAt';

    // Define query based on section
    switch (section) {
      case 'homepage':
      case 'featured':
        query.featured = true;
        sort = '-views';
        break;
      case 'most-popular':
        sort = '-views';
        break;
      case 'new-releases':
        sort = '-createdAt';
        break;
      case 'trending':
        query.featured = true;
        sort = '-rating.average';
        break;
      case 'best-sellers':
        sort = '-views';
        break;
      default:
        query.featured = true;
    }

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .populate('colors', 'name hex')
      .populate('sizes', 'name value')
      .sort(sort)
      .limit(parseInt(limit))
      .lean();

    res.status(200).json({
      success: true,
      section,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all recommended sections
// @route   GET /api/recommended
// @access  Public
exports.getAllRecommended = async (req, res, next) => {
  try {
    const sections = [
      'homepage',
      'most-popular',
      'new-releases',
      'trending',
      'best-sellers'
    ];

    const recommendations = {};

    for (const section of sections) {
      let query = { status: 'active' };
      let sort = '-createdAt';

      switch (section) {
        case 'homepage':
          query.featured = true;
          sort = '-views';
          break;
        case 'most-popular':
          sort = '-views';
          break;
        case 'new-releases':
          sort = '-createdAt';
          break;
        case 'trending':
          query.featured = true;
          sort = '-rating.average';
          break;
        case 'best-sellers':
          sort = '-views';
          break;
      }

      recommendations[section] = await Product.find(query)
        .populate('category', 'name')
        .populate('colors', 'name hex')
        .select('name slug price comparePrice images featured')
        .sort(sort)
        .limit(6)
        .lean();
    }

    res.status(200).json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product to recommended section (for admin customization)
// @route   POST /api/recommended/:section
// @access  Private/Admin
exports.addToRecommended = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const { section } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Mark product as featured for recommended sections
    if (!product.featured && section !== 'most-popular') {
      product.featured = true;
      await product.save();
    }

    res.status(200).json({
      success: true,
      message: 'Product added to recommended section',
      data: product
    });
  } catch (error) {
    next(error);
  }
};
