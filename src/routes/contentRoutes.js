const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  submitTestimony,
  getTestimonies,
  getEvents,
  createEvent,
  getAccounts,
  addAccount
} = require('../controllers/contentController');

// Testimonies
router.post('/testimony', protect, submitTestimony);
router.get('/testimonies/:branchId', getTestimonies);

// Events
router.get('/events', getEvents);
router.post('/events', protect, admin, createEvent);

// Accounts
router.get('/accounts/:branchId', getAccounts);
router.post('/accounts', protect, admin, addAccount);

module.exports = router;
