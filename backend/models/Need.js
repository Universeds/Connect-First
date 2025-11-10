const mongoose = require('mongoose');

const needSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    enum: ['Food', 'Clothing', 'Toiletries', 'Medical', 'Education', 'Other'],
    default: 'Other'
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  isTimeSensitive: {
    type: Boolean,
    default: false
  },
  deadline: {
    type: Date,
    default: null
  },
  frequencyCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Need', needSchema);
