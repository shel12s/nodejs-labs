const express = require('express');
const router  = express.Router();
const history = require('../controllers/historyController');
const { authOnly } = require('../middleware/authMiddleware');

router.get('/', authOnly, history.index);

module.exports = router;
