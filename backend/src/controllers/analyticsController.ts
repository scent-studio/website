const Analytics = require('../models/Analytics');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Review = require('../models/Review');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getAnalytics = asyncHandler(async (req: any, res: any) => {
  const { startDate, endDate } = req.query;

  const filter: any = {};
  if (startDate) filter.date = { $gte: new Date(startDate as string) };
  if (endDate) {
    filter.date = filter.date || {};
    filter.date.$lte = new Date(endDate as string);
  }

  const analytics = await Analytics.find(filter).sort('date');

  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();

  const revenueAgg = await Order.aggregate([
    { $match: { status: { $ne: 'cancelled' }, isPaid: true } },
    { $group: { _id: null, total: { $sum: '$total' } } },
  ]);

  const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

  const ordersByStatus = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const recentOrders = await Order.find()
    .populate('user', 'name email')
    .sort('-createdAt')
    .limit(5);

  const topProducts = await Product.find({ isVisible: true })
    .sort('-totalSales')
    .limit(10)
    .select('name slug totalSales price images');

  const summary = {
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue,
    ordersByStatus: ordersByStatus.reduce((acc: any, item: any) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
  };

  res.status(200).json(
    ApiResponse.success({
      analytics,
      summary,
      recentOrders,
      topProducts,
    })
  );
});

const getDashboardStats = asyncHandler(async (req: any, res: any) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayOrders = await Order.countDocuments({
    createdAt: { $gte: today },
  });

  const todayRevenueAgg = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: today },
        status: { $ne: 'cancelled' },
      },
    },
    { $group: { _id: null, total: { $sum: '$total' } } },
  ]);

  const todayRevenue = todayRevenueAgg.length > 0 ? todayRevenueAgg[0].total : 0;

  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();
  const lowStockCount = await Product.countDocuments({
    $expr: { $lte: ['$stock', '$lowStockThreshold'] },
  });

  const totalOrders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ status: 'pending' });

  const revenueAgg = await Order.aggregate([
    { $match: { status: { $ne: 'cancelled' }, isPaid: true } },
    { $group: { _id: null, total: { $sum: '$total' } } },
  ]);

  const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const revenueByDay = await Order.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo }, status: { $ne: 'cancelled' } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$total' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const ordersByMonth = await Order.aggregate([
    { $match: { createdAt: { $gte: twelveMonthsAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const recentOrders = await Order.find()
    .populate('user', 'name email')
    .sort('-createdAt')
    .limit(5)
    .select('_id user guestInfo orderItems total status orderStatus createdAt isGuestOrder');

  const topProducts = await Product.find({ isVisible: true })
    .sort('-totalSales')
    .limit(5)
    .select('name slug totalSales price images');

  const latestReviews = await Review.find()
    .populate('user', 'name avatar')
    .populate('product', 'name slug')
    .sort('-createdAt')
    .limit(5)
    .select('_id user product rating title comment isApproved createdAt');

  const lowStockProducts = await Product.find({
    $expr: { $lte: ['$stock', '$lowStockThreshold'] },
    isVisible: true,
  })
    .sort('stock')
    .limit(10)
    .select('name slug stock lowStockThreshold images');

  res.status(200).json(
    ApiResponse.success({
      todayOrders,
      todayRevenue,
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      lowStockCount,
      pendingOrders,
      revenueByDay: revenueByDay.map((r: any) => ({ date: r._id, revenue: r.revenue, orders: r.orders })),
      ordersByMonth: ordersByMonth.map((o: any) => ({ month: o._id, count: o.count })),
      recentOrders,
      topProducts,
      latestReviews,
      lowStockProducts,
    })
  );
});

const recordPageView = asyncHandler(async (req: any, res: any) => {
  const { route } = req.body;
  await Analytics.recordPageView(route || req.originalUrl);
  res.status(200).json({ success: true });
});

module.exports = {
  getAnalytics,
  getDashboardStats,
  recordPageView,
};

export {};
