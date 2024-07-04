const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  product: { type: String, required: true },
  amount: { type: Number, required: true },
  price: { type: Number, required: true },
  info: { type: String },
  addedAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Transaction', transactionSchema);
