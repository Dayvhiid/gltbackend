const Branch = require('../models/Branch');

// @desc    Get all branches
// @route   GET /api/branches
// @access  Public
const getBranches = async (req, res) => {
  try {
    const branches = await Branch.find().sort({ name: 1 });
    res.json(branches);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = { getBranches };