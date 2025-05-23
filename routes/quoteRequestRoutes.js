const express = require('express');
const {
  createQuoteRequest,
  getQuoteRequests,
  updateQuoteRequest,
  deleteQuoteRequest
} = require('../controllers/quoteRequestController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

// Protected routes - all require authentication
router.post('/', authenticateToken, createQuoteRequest);
router.get('/', authenticateToken, getQuoteRequests);

// Admin only routes
router.put('/:id', authenticateToken, authorizeAdmin, updateQuoteRequest);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteQuoteRequest);

module.exports = router;