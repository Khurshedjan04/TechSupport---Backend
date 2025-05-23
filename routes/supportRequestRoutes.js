const express = require('express');
const {
  createSupportRequest,
  getSupportRequests,
  updateSupportRequest,
  deleteSupportRequest
} = require('../controllers/supportRequestController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

// Protected routes - all require authentication
router.post('/', authenticateToken, createSupportRequest);
router.get('/', authenticateToken, getSupportRequests);

// Admin only routes
router.put('/:id', authenticateToken, authorizeAdmin, updateSupportRequest);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteSupportRequest);

module.exports = router;