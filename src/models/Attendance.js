const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'excused', 'checked-in'],
    default: 'present'
  },
  checkInTime: {
    type: Date
  },
  checkOutTime: {
    type: Date
  },
  duration: {
    type: Number, // In minutes
    default: 0
  },
  serviceType: {
    type: String, // e.g., 'Sunday Service', 'Mid-week Service', 'Event'
    default: 'Sunday Service'
  }
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
