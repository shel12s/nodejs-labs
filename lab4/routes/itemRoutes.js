const express = require('express');
const router  = express.Router();
const item    = require('../controllers/itemController');
const { authOnly, adminOnly } = require('../middleware/authMiddleware');

router.get('/',              authOnly, item.list);
router.get('/add',           authOnly, adminOnly, item.showAdd);
router.post('/add',          authOnly, adminOnly, item.add);
// Specific routes BEFORE :id to avoid conflicts
router.get('/:id/edit',      authOnly, adminOnly, item.showEdit);
router.post('/:id/edit',     authOnly, adminOnly, item.edit);
router.post('/:id/deduct',   authOnly, item.deduct);
router.post('/:id/delete',   authOnly, adminOnly, item.delete);
router.get('/:id',           authOnly, item.view);

module.exports = router;
