// Redirect unauthenticated users to login
function authOnly(req, res, next) {
  if (req.session && req.session.userId) return next();
  req.flash('error', 'Please log in to continue.');
  res.redirect('/auth/login');
}

// Restrict route to admin role only
function adminOnly(req, res, next) {
  if (req.session && req.session.role === 'admin') return next();
  req.flash('error', 'Access denied. Admins only.');
  res.redirect('/dashboard');
}

// Redirect already-logged-in users away from guest pages (login/register)
function guestOnly(req, res, next) {
  if (req.session && req.session.userId) return res.redirect('/dashboard');
  next();
}

module.exports = { authOnly, adminOnly, guestOnly };
