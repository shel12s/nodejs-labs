const express = require('express');
const router  = express.Router();
const auth    = require('../controllers/authController');
const { guestOnly } = require('../middleware/authMiddleware');

router.get('/login',    guestOnly, auth.showLogin);
router.post('/login',   guestOnly, auth.login);
router.get('/register', guestOnly, auth.showRegister);
router.post('/register',guestOnly, auth.register);
router.post('/logout',  auth.logout);

module.exports = router;
