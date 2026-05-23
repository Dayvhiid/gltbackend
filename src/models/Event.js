const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    default: null // Null means global event for all branches
  },
  type: {
    type: String,
    enum: ['event', 'announcement'],
    default: 'event'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', EventSchema);
