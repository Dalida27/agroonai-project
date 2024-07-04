const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  number: { type: String, required: true },
  order: { type: String, required: true },
  repeat: { type: String },
  info: { type: String },
  addedAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Client', clientSchema);
