const User = require('../models/User.model');

// @desc    Get current user's cart with product details
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'cart.product',
        select: 'name price comparePrice images stock discount rating',
      })
      .populate({
        path: 'cart.color',
        select: 'name hexCode',
      })
      .populate({
        path: 'cart.size',
        select: 'name code',
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user.cart || [],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to current user's cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, colorId, sizeId } = req.body || {};

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

    const qty = Number(quantity) > 0 ? Number(quantity) : 1;

    const existingItem = user.cart.find(
      (item) =>
        item.product.toString() === productId.toString() &&
        (!colorId || (item.color && item.color.toString() === colorId.toString())) &&
        (!sizeId || (item.size && item.size.toString() === sizeId.toString()))
    );

    if (existingItem) {
      existingItem.quantity += qty;
    } else {
      user.cart.push({
        product: productId,
        quantity: qty,
        color: colorId || undefined,
        size: sizeId || undefined,
      });
    }

    await user.save();

    const populatedUser = await User.findById(req.user.id)
      .populate({
        path: 'cart.product',
        select: 'name price comparePrice images stock discount rating',
      })
      .populate({
        path: 'cart.color',
        select: 'name hexCode',
      })
      .populate({
        path: 'cart.size',
        select: 'name code',
      });

    return res.status(200).json({
      success: true,
      data: populatedUser.cart || [],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove one item (first match by productId) from current user's cart
// @route   POST /api/cart/remove
// @access  Private
exports.removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.body || {};

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

    const index = user.cart.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (index > -1) {
      user.cart.splice(index, 1);
      await user.save();
    }

    const populatedUser = await User.findById(req.user.id)
      .populate({
        path: 'cart.product',
        select: 'name price comparePrice images stock discount rating',
      })
      .populate({
        path: 'cart.color',
        select: 'name hexCode',
      })
      .populate({
        path: 'cart.size',
        select: 'name code',
      });

    return res.status(200).json({
      success: true,
      data: populatedUser.cart || [],
    });
  } catch (error) {
    next(error);
  }
};

