const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  action:    { type: String, enum: ['add', 'update', 'deduct', 'delete'], required: true },
  itemId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  itemName:  { type: String, required: true },
  quantity:  { type: Number, default: 0 },
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username:  { type: String, required: true },
  note:      { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('History', historySchema);
