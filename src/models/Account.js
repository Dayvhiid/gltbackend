const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  bankName: {
    type: String,
    required: true
  },
  accountNumber: {
    type: String,
    required: true
  },
  accountName: {
    type: String,
    required: true
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  type: {
    type: String, // e.g., 'Tithe', 'Offering', 'Project'
    default: 'General'
  }
});

module.exports = mongoose.model('Account', AccountSchema);
