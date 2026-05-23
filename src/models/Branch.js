const mongoose = require('mongoose');

const BranchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  geofenceRadius: {
    type: Number,
    default: 200 // 200 meters default
  },
  contact: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Branch', BranchSchema);
