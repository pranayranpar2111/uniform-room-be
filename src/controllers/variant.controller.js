const Color = require('../models/Color.model');
const Size = require('../models/Size.model');

// ============== COLORS ==============

// @desc    Get all colors
// @route   GET /api/variants/colors
// @access  Public
exports.getColors = async (req, res, next) => {
  try {
    const colors = await Color.find({ status: 'active' }).sort('name');

    res.status(200).json({
      success: true,
      count: colors.length,
      data: colors
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create color
// @route   POST /api/variants/colors
// @access  Private/Admin
exports.createColor = async (req, res, next) => {
  try {
    const color = await Color.create(req.body);

    res.status(201).json({
      success: true,
      data: color
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update color
// @route   PUT /api/variants/colors/:id
// @access  Private/Admin
exports.updateColor = async (req, res, next) => {
  try {
    const color = await Color.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!color) {
      return res.status(404).json({
        success: false,
        message: 'Color not found'
      });
    }

    res.status(200).json({
      success: true,
      data: color
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete color
// @route   DELETE /api/variants/colors/:id
// @access  Private/Admin
exports.deleteColor = async (req, res, next) => {
  try {
    const color = await Color.findByIdAndDelete(req.params.id);

    if (!color) {
      return res.status(404).json({
        success: false,
        message: 'Color not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Color deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ============== SIZES ==============

// @desc    Get all sizes
// @route   GET /api/variants/sizes
// @access  Public
exports.getSizes = async (req, res, next) => {
  try {
    const { category } = req.query;

    const query = { status: 'active' };
    if (category) query.category = category;

    const sizes = await Size.find(query).sort('order');

    res.status(200).json({
      success: true,
      count: sizes.length,
      data: sizes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create size
// @route   POST /api/variants/sizes
// @access  Private/Admin
exports.createSize = async (req, res, next) => {
  try {
    const size = await Size.create(req.body);

    res.status(201).json({
      success: true,
      data: size
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update size
// @route   PUT /api/variants/sizes/:id
// @access  Private/Admin
exports.updateSize = async (req, res, next) => {
  try {
    const size = await Size.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!size) {
      return res.status(404).json({
        success: false,
        message: 'Size not found'
      });
    }

    res.status(200).json({
      success: true,
      data: size
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete size
// @route   DELETE /api/variants/sizes/:id
// @access  Private/Admin
exports.deleteSize = async (req, res, next) => {
  try {
    const size = await Size.findByIdAndDelete(req.params.id);

    if (!size) {
      return res.status(404).json({
        success: false,
        message: 'Size not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Size deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
