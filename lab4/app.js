const express        = require('express');
const session        = require('express-session');
const flash          = require('connect-flash');
const path           = require('path');
const expressLayouts = require('express-ejs-layouts');
const Database       = require('./config/database');

const authRoutes    = require('./routes/authRoutes');
const itemRoutes    = require('./routes/itemRoutes');
const historyRoutes = require('./routes/historyRoutes');
const dashboard     = require('./controllers/dashboardController');
const { authOnly }  = require('./middleware/authMiddleware');

const app  = express();
const PORT = 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session & flash
app.use(session({
  secret: 'inventory_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 2 }, // 2 hours
}));
app.use(flash());

// Make session & flash available in all views
app.use((req, res, next) => {
  res.locals.session  = req.session;
  res.locals.messages = {
    success: req.flash('success'),
    error:   req.flash('error'),
  };
  next();
});

// Routes
app.get('/', (req, res) => res.redirect('/dashboard'));
app.get('/dashboard', authOnly, dashboard.index);
app.use('/auth',    authRoutes);
app.use('/items',   itemRoutes);
app.use('/history', historyRoutes);

// 404
app.use((req, res) => {
  res.status(404).render('error', { title: 'Not Found', status: 404, message: 'Page not found.' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { title: 'Error', status: 500, message: err.message });
});

// Connect DB then start server (demonstrates Singleton)
const db = Database.getInstance();
Database.getInstance(); // intentional second call to show Singleton reuse in console

db.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`[Server] Running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('[Server] Failed to connect to MongoDB:', err.message);
  process.exit(1);
});
