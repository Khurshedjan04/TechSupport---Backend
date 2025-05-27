const express = require('express');
const { registerUser, loginUser, deleteUser, getAllUsers, getMe, addAdminOrTechnician } = require('../controllers/userController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', getMe);

// Admin only routes
router.post("/add-user",  addAdminOrTechnician);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteUser);
router.get('/', authenticateToken, authorizeAdmin, getAllUsers);

module.exports = router;