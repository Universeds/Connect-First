const mongoose = require('mongoose');

const basketSchema = new mongoose.Schema({
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
  }
}, {
  timestamps: true
});

// Ensure unique combination of username and needId
basketSchema.index({ username: 1, needId: 1 }, { unique: true });

module.exports = mongoose.model('Basket', basketSchema);
