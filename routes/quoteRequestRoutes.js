const express = require('express');
const {
  createQuoteRequest,
  getQuoteRequests,
  updateQuoteRequest,
  deleteQuoteRequest,
  updateQuoteRequestByTechnician
} = require('../controllers/quoteRequestController');
const { authenticateToken, authorizeAdmin, authorizeTechnician } = require('../middleware/auth');

const router = express.Router();

// Protected routes - all require authentication
router.post('/', authenticateToken, createQuoteRequest);
router.get('/', authenticateToken, getQuoteRequests);

// Admin only routes
router.put('/:id', authenticateToken, authorizeAdmin, updateQuoteRequest);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteQuoteRequest);

// Technician update route
router.put("/tech/:id", authenticateToken, authorizeTechnician, updateQuoteRequestByTechnician);

module.exports = router;