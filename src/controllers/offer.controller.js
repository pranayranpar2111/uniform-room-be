const Banner = require('../models/Banner.model');
const Discount = require('../models/Discount.model');

// ============== BANNERS ==============

// @desc    Get all banners
// @route   GET /api/offers/banners
// @access  Public
exports.getBanners = async (req, res, next) => {
  try {
    const { status, type } = req.query;

    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;

    // For public access, only show active banners within date range
    if (!req.user || req.user.role !== 'admin') {
      query.status = 'active';
      query.startDate = { $lte: new Date() };
      query.endDate = { $gte: new Date() };
    }

    const banners = await Banner.find(query).sort('order');

    res.status(200).json({
      success: true,
      count: banners.length,
      data: banners
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single banner
// @route   GET /api/offers/banners/:id
// @access  Public
exports.getBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    res.status(200).json({
      success: true,
      data: banner
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create banner
// @route   POST /api/offers/banners
// @access  Private/Admin
exports.createBanner = async (req, res, next) => {
  try {
    const banner = await Banner.create(req.body);

    res.status(201).json({
      success: true,
      data: banner
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update banner
// @route   PUT /api/offers/banners/:id
// @access  Private/Admin
exports.updateBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    res.status(200).json({
      success: true,
      data: banner
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete banner
// @route   DELETE /api/offers/banners/:id
// @access  Private/Admin
exports.deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Banner deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ============== DISCOUNTS ==============

// @desc    Get all discounts
// @route   GET /api/offers/discounts
// @access  Private/Admin or Public (limited)
exports.getDiscounts = async (req, res, next) => {
  try {
    const { status } = req.query;

    const query = {};
    if (status) query.status = status;

    // For public access, only show active discounts
    if (!req.user || req.user.role !== 'admin') {
      query.status = 'active';
      query.startDate = { $lte: new Date() };
      query.endDate = { $gte: new Date() };
    }

    const discounts = await Discount.find(query)
      .populate('applicableProducts', 'name sku')
      .populate('applicableCategories', 'name')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: discounts.length,
      data: discounts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify discount code
// @route   POST /api/offers/discounts/verify
// @access  Public
exports.verifyDiscount = async (req, res, next) => {
  try {
    const { code } = req.body;

    const discount = await Discount.findOne({
      code: code.toUpperCase()
    });

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: 'Invalid discount code'
      });
    }

    if (!discount.isValid()) {
      return res.status(400).json({
        success: false,
        message: 'Discount code is expired or no longer valid'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        code: discount.code,
        type: discount.type,
        value: discount.value,
        minPurchase: discount.minPurchase,
        maxDiscount: discount.maxDiscount
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create discount
// @route   POST /api/offers/discounts
// @access  Private/Admin
exports.createDiscount = async (req, res, next) => {
  try {
    const discount = await Discount.create(req.body);

    res.status(201).json({
      success: true,
      data: discount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update discount
// @route   PUT /api/offers/discounts/:id
// @access  Private/Admin
exports.updateDiscount = async (req, res, next) => {
  try {
    const discount = await Discount.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: 'Discount not found'
      });
    }

    res.status(200).json({
      success: true,
      data: discount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete discount
// @route   DELETE /api/offers/discounts/:id
// @access  Private/Admin
exports.deleteDiscount = async (req, res, next) => {
  try {
    const discount = await Discount.findByIdAndDelete(req.params.id);

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: 'Discount not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Discount deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
