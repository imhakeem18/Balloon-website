
// backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

// Login
router.post('/login', authController.login);

// Verify token
router.get('/verify', verifyToken, authController.verifyToken);

// Change password
router.post('/change-password', verifyToken, authController.changePassword);

// Create initial admin (only if no admins exist)
router.post('/setup', authController.createInitialAdmin);

module.exports = router;