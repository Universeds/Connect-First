const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  needId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Need',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  totalCost: {
    type: Number,
    required: true,
    min: 0
  },
  transactionDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
