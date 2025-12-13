const SizeChart = require('../models/SizeChart.model');

// @desc    Get all size charts
// @route   GET /api/size-charts
// @access  Public
exports.getSizeCharts = async (req, res, next) => {
  try {
    const { category, status } = req.query;

    const query = {};
    if (category) query.category = category;
    if (status) query.status = status;

    const sizeCharts = await SizeChart.find(query)
      .populate('category', 'name slug')
      .sort('name');

    res.status(200).json({
      success: true,
      count: sizeCharts.length,
      data: sizeCharts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single size chart
// @route   GET /api/size-charts/:id
// @access  Public
exports.getSizeChart = async (req, res, next) => {
  try {
    const sizeChart = await SizeChart.findById(req.params.id).populate(
      'category',
      'name slug'
    );

    if (!sizeChart) {
      return res.status(404).json({
        success: false,
        message: 'Size chart not found'
      });
    }

    res.status(200).json({
      success: true,
      data: sizeChart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create size chart
// @route   POST /api/size-charts
// @access  Private/Admin
exports.createSizeChart = async (req, res, next) => {
  try {
    const sizeChart = await SizeChart.create(req.body);

    res.status(201).json({
      success: true,
      data: sizeChart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update size chart
// @route   PUT /api/size-charts/:id
// @access  Private/Admin
exports.updateSizeChart = async (req, res, next) => {
  try {
    const sizeChart = await SizeChart.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!sizeChart) {
      return res.status(404).json({
        success: false,
        message: 'Size chart not found'
      });
    }

    res.status(200).json({
      success: true,
      data: sizeChart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete size chart
// @route   DELETE /api/size-charts/:id
// @access  Private/Admin
exports.deleteSizeChart = async (req, res, next) => {
  try {
    const sizeChart = await SizeChart.findByIdAndDelete(req.params.id);

    if (!sizeChart) {
      return res.status(404).json({
        success: false,
        message: 'Size chart not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Size chart deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
