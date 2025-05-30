const express = require('express');
const {
  createSupportRequest,
  getSupportRequests,
  updateSupportRequest,
  deleteSupportRequest,
  updateSupportRequestByTechnician
} = require('../controllers/supportRequestController');
const { authenticateToken, authorizeAdmin, authorizeTechnician } = require('../middleware/auth');

const router = express.Router();

// Protected routes - all require authentication
router.post('/', authenticateToken, createSupportRequest);
router.get('/', authenticateToken, getSupportRequests);

// Admin only routes
router.put('/:id', authenticateToken, authorizeAdmin, updateSupportRequest);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteSupportRequest);

// Technician only routes
router.put("/tech/:id", authenticateToken, authorizeTechnician, updateSupportRequestByTechnician);

module.exports = router;