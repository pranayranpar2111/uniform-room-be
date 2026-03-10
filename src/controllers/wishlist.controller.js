const User = require('../models/User.model');

// @desc    Get current user's wishlist with product details
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'wishlist',
      select: 'name price comparePrice images stock discount rating',
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user.wishlist || [],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle product in current user's wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
exports.toggleWishlistItem = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const existingIndex = user.wishlist.findIndex(
      (id) => id.toString() === productId.toString()
    );

    if (existingIndex > -1) {
      user.wishlist.splice(existingIndex, 1);
    } else {
      user.wishlist.push(productId);
    }

    await user.save();

    const populatedUser = await User.findById(req.user.id).populate({
      path: 'wishlist',
      select: 'name price comparePrice images stock discount rating',
    });

    return res.status(200).json({
      success: true,
      data: populatedUser.wishlist || [],
    });
  } catch (error) {
    next(error);
  }
};

