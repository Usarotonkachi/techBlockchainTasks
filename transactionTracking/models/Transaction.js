const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  hash: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  value: { type: String, required: true },
  timestamp: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
