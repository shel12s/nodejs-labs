const User = require('../models/User');
const UserFactory = require('../services/UserFactory');

// GET /auth/login
exports.showLogin = (req, res) => {
  res.render('auth/login', { title: 'Login' });
};

// POST /auth/login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      req.flash('error', 'Invalid username or password.');
      return res.redirect('/auth/login');
    }
    const match = await user.verifyPassword(password);
    if (!match) {
      req.flash('error', 'Invalid username or password.');
      return res.redirect('/auth/login');
    }
    req.session.userId   = user._id;
    req.session.username = user.username;
    req.session.role     = user.role;
    res.redirect('/dashboard');
  } catch (err) {
    next(err);
  }
};

// GET /auth/register
exports.showRegister = (req, res) => {
  res.render('auth/register', { title: 'Register' });
};

// POST /auth/register
exports.register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;
    const safeRole = role === 'admin' ? 'admin' : 'user';
    const userData = UserFactory.create(safeRole, { username, email, password });
    await User.create(userData);
    req.flash('success', 'Account created. Please log in.');
    res.redirect('/auth/login');
  } catch (err) {
    if (err.code === 11000) {
      req.flash('error', 'Username or email already taken.');
      return res.redirect('/auth/register');
    }
    next(err);
  }
};

// POST /auth/logout
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
};
