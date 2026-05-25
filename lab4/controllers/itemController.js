const Item = require('../models/Item');
const History = require('../models/History');
const observer = require('../services/InventoryObserver');

// GET /items
exports.list = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const filter = {};
    if (search)   filter.name = { $regex: search, $options: 'i' };
    if (category) filter.category = category;

    const [items, categories] = await Promise.all([
      Item.find(filter).sort({ name: 1 }),
      Item.distinct('category'),
    ]);
    res.render('items/list', { title: 'Inventory', items, categories, search, category });
  } catch (err) { next(err); }
};

// GET /items/add
exports.showAdd = (req, res) => {
  res.render('items/add', { title: 'Add Item' });
};

// POST /items/add
exports.add = async (req, res, next) => {
  try {
    const { name, description, category, quantity, minQuantity, price } = req.body;
    const item = await Item.create({ name, description, category, quantity, minQuantity, price });

    await History.create({
      action: 'add', itemId: item._id, itemName: item.name,
      quantity: item.quantity, userId: req.session.userId, username: req.session.username,
      note: 'Item created',
    });

    observer.notifyTransaction('add', item.name, item.quantity, req.session.username);
    if (item.quantity < item.minQuantity) {
      observer.notifyLowStock(item.name, item.quantity, item.minQuantity);
    }

    req.flash('success', `Item "${item.name}" added.`);
    res.redirect('/items');
  } catch (err) { next(err); }
};

// GET /items/:id
exports.view = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) { req.flash('error', 'Item not found.'); return res.redirect('/items'); }
    const history = await History.find({ itemId: item._id }).sort({ createdAt: -1 }).limit(10);
    res.render('items/view', { title: item.name, item, history });
  } catch (err) { next(err); }
};

// GET /items/:id/edit
exports.showEdit = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) { req.flash('error', 'Item not found.'); return res.redirect('/items'); }
    res.render('items/edit', { title: `Edit: ${item.name}`, item });
  } catch (err) { next(err); }
};

// POST /items/:id/edit
exports.edit = async (req, res, next) => {
  try {
    const { name, description, category, quantity, minQuantity, price } = req.body;
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { name, description, category, quantity, minQuantity, price, updatedAt: new Date() },
      { new: true }
    );
    if (!item) { req.flash('error', 'Item not found.'); return res.redirect('/items'); }

    await History.create({
      action: 'update', itemId: item._id, itemName: item.name,
      quantity: item.quantity, userId: req.session.userId, username: req.session.username,
      note: 'Item updated',
    });

    observer.notifyTransaction('update', item.name, item.quantity, req.session.username);
    if (item.quantity < item.minQuantity) {
      observer.notifyLowStock(item.name, item.quantity, item.minQuantity);
    }

    req.flash('success', `Item "${item.name}" updated.`);
    res.redirect('/items');
  } catch (err) { next(err); }
};

// POST /items/:id/deduct
exports.deduct = async (req, res, next) => {
  try {
    const { amount, note } = req.body;
    const qty = parseInt(amount, 10);
    const item = await Item.findById(req.params.id);
    if (!item) { req.flash('error', 'Item not found.'); return res.redirect('/items'); }
    if (qty <= 0 || qty > item.quantity) {
      req.flash('error', 'Invalid deduction amount.');
      return res.redirect(`/items/${item._id}`);
    }

    item.quantity -= qty;
    await item.save();

    await History.create({
      action: 'deduct', itemId: item._id, itemName: item.name,
      quantity: qty, userId: req.session.userId, username: req.session.username,
      note: note || 'Stock deducted',
    });

    observer.notifyTransaction('deduct', item.name, qty, req.session.username);
    if (item.quantity < item.minQuantity) {
      observer.notifyLowStock(item.name, item.quantity, item.minQuantity);
    }

    req.flash('success', `Deducted ${qty} from "${item.name}".`);
    res.redirect(`/items/${item._id}`);
  } catch (err) { next(err); }
};

// POST /items/:id/delete  (admin only)
exports.delete = async (req, res, next) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) { req.flash('error', 'Item not found.'); return res.redirect('/items'); }

    await History.create({
      action: 'delete', itemId: item._id, itemName: item.name,
      quantity: item.quantity, userId: req.session.userId, username: req.session.username,
      note: 'Item deleted',
    });

    observer.notifyTransaction('delete', item.name, item.quantity, req.session.username);

    req.flash('success', `Item "${item.name}" deleted.`);
    res.redirect('/items');
  } catch (err) { next(err); }
};
