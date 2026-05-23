const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['member', 'steward', 'admin'],
    default: 'member'
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch'
  },
  stewardRequested: {
    type: Boolean,
    default: false
  },
  verification: {
    status: {
      type: String,
      enum: ['none', 'pending', 'approved', 'rejected'],
      default: 'none'
    },
    document: {
      type: String,
      default: null
    },
    submittedAt: {
      type: Date
    },
    reviewedAt: {
      type: Date
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    notes: {
      type: String
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
