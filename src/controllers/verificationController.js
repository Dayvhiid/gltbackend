const Verification = require('../models/Verification');
const User = require('../models/User');
const path = require('path');

// @desc Upload verification document (steward applicants)
// @route POST /api/verification/upload
// @access Private
const uploadVerification = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No document uploaded' });
    }

    const documentPath = path.join('uploads', 'verifications', req.file.filename);

    const verification = new Verification({
      user: req.user.id,
      document: documentPath,
      status: 'pending'
    });

    await verification.save();

    // Update user record to reflect pending verification
    const user = await User.findById(req.user.id);
    if (user) {
      user.stewardRequested = true;
      user.verification.status = 'pending';
      user.verification.document = documentPath;
      user.verification.submittedAt = verification.submittedAt;
      await user.save();
    }

    res.status(201).json(verification);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc Get pending verifications
// @route GET /api/verification/pending
// @access Private (Admin)
const getPendingVerifications = async (req, res) => {
  try {
    const pending = await Verification.find({ status: 'pending' }).populate('user', ['fullName', 'email', 'branch']);
    res.json(pending);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc Approve a verification
// @route POST /api/verification/:id/approve
// @access Private (Admin)
const approveVerification = async (req, res) => {
  try {
    const verification = await Verification.findById(req.params.id);
    if (!verification) return res.status(404).json({ msg: 'Verification not found' });

    verification.status = 'approved';
    verification.reviewedAt = new Date();
    verification.reviewer = req.user.id;
    verification.notes = req.body.notes || '';

    await verification.save();

    const user = await User.findById(verification.user);
    if (user) {
      user.role = 'steward';
      user.verification.status = 'approved';
      user.verification.reviewedAt = verification.reviewedAt;
      user.verification.reviewer = verification.reviewer;
      user.verification.notes = verification.notes;
      await user.save();
    }

    res.json({ verification, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc Reject a verification
// @route POST /api/verification/:id/reject
// @access Private (Admin)
const rejectVerification = async (req, res) => {
  try {
    const verification = await Verification.findById(req.params.id);
    if (!verification) return res.status(404).json({ msg: 'Verification not found' });

    verification.status = 'rejected';
    verification.reviewedAt = new Date();
    verification.reviewer = req.user.id;
    verification.notes = req.body.notes || '';

    await verification.save();

    const user = await User.findById(verification.user);
    if (user) {
      user.verification.status = 'rejected';
      user.verification.reviewedAt = verification.reviewedAt;
      user.verification.reviewer = verification.reviewer;
      user.verification.notes = verification.notes;
      // keep role as member
      await user.save();
    }

    res.json({ verification, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  uploadVerification,
  getPendingVerifications,
  approveVerification,
  rejectVerification
};
