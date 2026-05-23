const mongoose = require('mongoose');

const TestimonySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  isApproved: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Testimony', TestimonySchema);
