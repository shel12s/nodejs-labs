const History = require('../models/History');

// GET /history
exports.index = async (req, res, next) => {
  try {
    const { action } = req.query;
    const filter = {};
    if (action) filter.action = action;

    const history = await History.find(filter).sort({ createdAt: -1 }).limit(100);
    res.render('history/index', { title: 'Transaction History', history, action });
  } catch (err) { next(err); }
};
