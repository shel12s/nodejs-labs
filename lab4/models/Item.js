const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  category:    { type: String, default: 'General', trim: true },
  quantity:    { type: Number, required: true, min: 0, default: 0 },
  minQuantity: { type: Number, required: true, min: 0, default: 5 },
  price:       { type: Number, required: true, min: 0 },
  createdAt:   { type: Date, default: Date.now },
  updatedAt:   { type: Date, default: Date.now },
});

itemSchema.pre('save', async function () {
  this.updatedAt = new Date();
});

itemSchema.virtual('isLowStock').get(function () {
  return this.quantity < this.minQuantity;
});

module.exports = mongoose.model('Item', itemSchema);
