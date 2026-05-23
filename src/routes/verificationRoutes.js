const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
  uploadVerification,
  getPendingVerifications,
  approveVerification,
  rejectVerification
} = require('../controllers/verificationController');

router.post('/upload', protect, upload.single('document'), uploadVerification);
router.get('/pending', protect, admin, getPendingVerifications);
router.post('/:id/approve', protect, admin, approveVerification);
router.post('/:id/reject', protect, admin, rejectVerification);

module.exports = router;
