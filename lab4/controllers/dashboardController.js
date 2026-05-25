const Item = require('../models/Item');
const History = require('../models/History');

// GET /dashboard
exports.index = async (req, res, next) => {
  try {
    const [totalItems, lowStockItems, recentHistory, totalCategories] = await Promise.all([
      Item.countDocuments(),
      Item.find({ $expr: { $lt: ['$quantity', '$minQuantity'] } }),
      History.find().sort({ createdAt: -1 }).limit(5),
      Item.distinct('category'),
    ]);

    res.render('dashboard', {
      title: 'Dashboard',
      totalItems,
      lowStockItems,
      recentHistory,
      totalCategories: totalCategories.length,
    });
  } catch (err) { next(err); }
};
