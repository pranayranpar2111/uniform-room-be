const Product = require('../models/Product.model');
const Order = require('../models/Order.model');
const User = require('../models/User.model');
const Inquiry = require('../models/Inquiry.model');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const firstDayOfLastMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    const lastDayOfLastMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    );

    // Get total revenue
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $in: ['delivered', 'processing', 'shipped'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    // Get this month's revenue
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          status: { $in: ['delivered', 'processing', 'shipped'] },
          createdAt: { $gte: firstDayOfMonth },
        },
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    // Get last month's revenue
    const lastMonthRevenue = await Order.aggregate([
      {
        $match: {
          status: { $in: ['delivered', 'processing', 'shipped'] },
          createdAt: { $gte: firstDayOfLastMonth, $lte: lastDayOfLastMonth },
        },
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    // Calculate revenue growth
    const currentMonthRev = monthlyRevenue[0]?.total || 0;
    const lastMonthRev = lastMonthRevenue[0]?.total || 0;
    const revenueGrowth =
      lastMonthRev > 0
        ? ((currentMonthRev - lastMonthRev) / lastMonthRev) * 100
        : 0;

    // Get total orders
    const totalOrders = await Order.countDocuments();
    const monthlyOrders = await Order.countDocuments({
      createdAt: { $gte: firstDayOfMonth },
    });
    const lastMonthOrders = await Order.countDocuments({
      createdAt: { $gte: firstDayOfLastMonth, $lte: lastDayOfLastMonth },
    });

    // Calculate orders growth
    const ordersGrowth =
      lastMonthOrders > 0
        ? ((monthlyOrders - lastMonthOrders) / lastMonthOrders) * 100
        : 0;

    // Get total customers
    const totalCustomers = await User.countDocuments({ role: 'user' });
    const monthlyCustomers = await User.countDocuments({
      role: 'user',
      createdAt: { $gte: firstDayOfMonth },
    });
    const lastMonthCustomers = await User.countDocuments({
      role: 'user',
      createdAt: { $gte: firstDayOfLastMonth, $lte: lastDayOfLastMonth },
    });

    // Calculate customers growth
    const customersGrowth =
      lastMonthCustomers > 0
        ? ((monthlyCustomers - lastMonthCustomers) / lastMonthCustomers) * 100
        : 0;

    // Get products stats
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ status: 'active' });
    const lowStockProducts = await Product.countDocuments({
      $expr: { $lte: ['$stock', '$lowStockThreshold'] },
    });

    // Get pending inquiries
    const pendingInquiries = await Inquiry.countDocuments({ status: 'pending' });
    const totalInquiries = await Inquiry.countDocuments();

    // Get order status breakdown
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Get recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort('-createdAt')
      .limit(10)
      .lean();

    // Get top selling products
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: {
            $sum: { $multiply: ['$items.quantity', '$items.price'] },
          },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    // Populate product details for top products
    await Product.populate(topProducts, {
      path: '_id',
      select: 'name images price',
    });

    // Get revenue chart data (last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dailyRevenue = await Order.aggregate([
        {
          $match: {
            status: { $in: ['delivered', 'processing', 'shipped'] },
            createdAt: { $gte: date, $lt: nextDate },
          },
        },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]);

      last7Days.push({
        date: date.toISOString().split('T')[0],
        revenue: dailyRevenue[0]?.total || 0,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalRevenue: totalRevenue[0]?.total || 0,
          monthlyRevenue: currentMonthRev,
          revenueGrowth: Math.round(revenueGrowth * 10) / 10,
          totalOrders,
          monthlyOrders,
          ordersGrowth: Math.round(ordersGrowth * 10) / 10,
          totalCustomers,
          monthlyCustomers,
          customersGrowth: Math.round(customersGrowth * 10) / 10,
          totalProducts,
          activeProducts,
          lowStockProducts,
          pendingInquiries,
          totalInquiries,
        },
        ordersByStatus: ordersByStatus.map((item) => ({
          status: item._id,
          count: item.count,
        })),
        recentOrders: recentOrders.map((order) => ({
          _id: order._id,
          orderNumber: order.orderNumber,
          customer: order.user?.name || 'Guest',
          email: order.user?.email,
          totalAmount: order.totalAmount,
          status: order.status,
          createdAt: order.createdAt,
        })),
        topProducts: topProducts.map((item) => ({
          product: item._id,
          totalSold: item.totalSold,
          totalRevenue: item.totalRevenue,
        })),
        revenueChart: last7Days,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get sales analytics
// @route   GET /api/dashboard/analytics
// @access  Private/Admin
exports.getSalesAnalytics = async (req, res, next) => {
  try {
    const { period = 'month' } = req.query;

    let dateRange;
    const currentDate = new Date();

    switch (period) {
      case 'week':
        dateRange = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        dateRange = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );
        break;
      case 'year':
        dateRange = new Date(currentDate.getFullYear(), 0, 1);
        break;
      default:
        dateRange = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );
    }

    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: dateRange },
          status: { $in: ['delivered', 'processing', 'shipped'] },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          totalSales: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        period,
        salesData: salesData.map((item) => ({
          date: item._id,
          totalSales: item.totalSales,
          orderCount: item.orderCount,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};
