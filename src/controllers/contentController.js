const Testimony = require('../models/Testimony');
const Event = require('../models/Event');
const Account = require('../models/Account');

// --- TESTIMONIES ---

// @desc    Submit a testimony
// @route   POST /api/content/testimony
// @access  Private
const submitTestimony = async (req, res) => {
  try {
    const { title, content, branch } = req.body;
    const newTestimony = new Testimony({
      user: req.user.id,
      title,
      content,
      branch
    });
    const testimony = await newTestimony.save();
    res.status(201).json(testimony);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get testimonies for a branch
// @route   GET /api/content/testimonies/:branchId
// @access  Public
const getTestimonies = async (req, res) => {
  try {
    const testimonies = await Testimony.find({ branch: req.params.branchId, isApproved: true })
      .sort({ date: -1 });
    res.json(testimonies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// --- EVENTS ---

// @desc    Get all events
// @route   GET /api/content/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Create an event
// @route   POST /api/content/events
// @access  Private (Admin)
const createEvent = async (req, res) => {
  try {
    const { title, description, date, branch, type } = req.body;
    const newEvent = new Event({
      title, description, date, branch, type
    });
    const event = await newEvent.save();
    res.status(201).json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// --- ACCOUNTS ---

// @desc    Get account details for a branch
// @route   GET /api/content/accounts/:branchId
// @access  Public
const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ branch: req.params.branchId });
    res.json(accounts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Add account details
// @route   POST /api/content/accounts
// @access  Private
const addAccount = async (req, res) => {
  try {
    const { bankName, accountNumber, accountName, branch, type } = req.body;
    const newAccount = new Account({
      bankName, accountNumber, accountName, branch, type
    });
    const account = await newAccount.save();
    res.status(201).json(account);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  submitTestimony,
  getTestimonies,
  getEvents,
  createEvent,
  getAccounts,
  addAccount
};
