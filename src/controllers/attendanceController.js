const Attendance = require('../models/Attendance');

// @desc    Start attendance session via geofence
// @route   POST /api/attendance/check-in
// @access  Private
const checkIn = async (req, res) => {
  const { branchId, serviceType } = req.body;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({
      user: req.user.id,
      branch: branchId,
      date: { $gte: today }
    });

    if (attendance) {
      if (attendance.status === 'checked-in') {
        return res.json(attendance);
      }
      attendance.status = 'checked-in';
      attendance.checkInTime = new Date();
    } else {
      attendance = new Attendance({
        user: req.user.id,
        branch: branchId,
        status: 'checked-in',
        checkInTime: new Date(),
        serviceType: serviceType || 'Sunday Service'
      });
    }

    await attendance.save();
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    End attendance session via geofence
// @route   POST /api/attendance/check-out
// @access  Private
const checkOut = async (req, res) => {
  const { branchId } = req.body;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({
      user: req.user.id,
      branch: branchId,
      status: 'checked-in',
      date: { $gte: today }
    });

    if (!attendance) {
      return res.status(404).json({ msg: 'No active session found' });
    }

    const checkOutTime = new Date();
    const diffMs = checkOutTime.getTime() - attendance.checkInTime.getTime();
    const durationMinutes = Math.round(diffMs / 60000);

    attendance.checkOutTime = checkOutTime;
    attendance.duration = (attendance.duration || 0) + durationMinutes;
    attendance.status = 'present';

    await attendance.save();
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Manual attendance mark
// @route   POST /api/attendance
// @access  Private
const markAttendance = async (req, res) => {
  const { branch, status, serviceType, userId } = req.body;

  try {
    const newAttendance = new Attendance({
      user: userId || req.user.id,
      branch,
      status,
      serviceType
    });

    const attendance = await newAttendance.save();
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get attendance history for a user
// @route   GET /api/attendance/user/:userId
// @access  Private
const getUserAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ user: req.params.userId }).sort({ date: -1 });
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get attendance stats for a branch
// @route   GET /api/attendance/branch/:branchId
// @access  Private (Admin/Steward)
const getBranchAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ branch: req.params.branchId }).populate('user', ['fullName', 'email']);
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  checkIn,
  checkOut,
  markAttendance,
  getUserAttendance,
  getBranchAttendance
};
