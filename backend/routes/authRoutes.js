const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  forgotPassword,
  verifyResetOtp,
  resetPassword
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOtp);
router.put('/reset-password', resetPassword);

// Protected routes
router.get('/me', protect, getUserProfile);

module.exports = router;
