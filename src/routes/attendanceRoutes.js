const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  checkIn,
  checkOut,
  markAttendance,
  getUserAttendance,
  getBranchAttendance
} = require('../controllers/attendanceController');

router.post('/check-in', protect, checkIn);
router.post('/check-out', protect, checkOut);
router.post('/', protect, markAttendance);
router.get('/user/:userId', protect, getUserAttendance);
router.get('/branch/:branchId', protect, getBranchAttendance);

module.exports = router;
