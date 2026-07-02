const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  const { name, email, phone, password } = req.body;

  try {
    // Basic validations
    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please enter all required fields (name, email, password)');
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists with this email');
    }

    // Create user (password is automatically hashed by model pre-save hook)
    const user = await User.create({
      name,
      email,
      phone,
      password
    });

    if (user) {
      res.status(201).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        token: generateToken(user._id)
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data provided');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.status(400);
      throw new Error('Please enter email and password');
    }

    // Find user by email
    const user = await User.findOne({ email });

    // Compare passwords
    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        token: generateToken(user._id)
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Request password reset OTP
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    if (!email) {
      res.status(400);
      throw new Error('Please provide an email address');
    }

    const user = await User.findOne({ email });

    // Generic response message to prevent email enumeration attacks
    const genericResponse = {
      success: true,
      message: 'If this email exists, an OTP has been sent.'
    };

    if (!user) {
      // Return the dummy OTP in dev mode only
      if (process.env.NODE_ENV === 'development') {
        genericResponse.otp = '123456';
      }
      return res.status(200).json(genericResponse);
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP before saving
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    // Save resetOtp and resetOtpExpire (expires in 10 minutes)
    user.resetOtp = hashedOtp;
    user.resetOtpExpire = Date.now() + 10 * 60 * 1000;
    user.isResetOtpVerified = false;
    await user.save();

    // Send OTP to user's email
    try {
      await sendEmail({
        email: user.email,
        subject: 'FindItBack Password Reset OTP',
        message: `Your password reset OTP is ${otp}. It is valid for 10 minutes.`,
        html: `<p>Your password reset OTP is <b>${otp}</b>. It is valid for 10 minutes.</p>`
      });
    } catch (emailError) {
      console.error('Nodemailer error sending email:', emailError.message);
      // In production, we throw an error. In development, we allow the request to succeed so we can test via the returned response OTP.
      if (process.env.NODE_ENV !== 'development') {
        res.status(500);
        throw new Error('Email could not be sent. Please try again later.');
      }
    }

    // In development mode only, also return OTP in response for testing
    if (process.env.NODE_ENV === 'development') {
      genericResponse.otp = otp;
    }

    res.status(200).json(genericResponse);
  } catch (error) {
    next(error);
  }
};

// @desc    Verify password reset OTP
// @route   POST /api/auth/verify-reset-otp
// @access  Public
const verifyResetOtp = async (req, res, next) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      res.status(400);
      throw new Error('Please provide email and OTP');
    }

    // Hash the entered OTP to compare with the stored hashed OTP
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    // Find user by email, matching hashed OTP, and check if OTP has not expired
    const user = await User.findOne({
      email,
      resetOtp: hashedOtp,
      resetOtpExpire: { $gt: Date.now() }
    });

    if (!user) {
      res.status(400);
      throw new Error('Invalid or expired OTP');
    }

    // Set isResetOtpVerified true
    user.isResetOtpVerified = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password using verified email context
// @route   PUT /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and new password');
    }

    if (password.length < 6) {
      res.status(400);
      throw new Error('Password must be at least 6 characters');
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Confirm that the OTP was verified for this user context
    if (!user.isResetOtpVerified) {
      res.status(400);
      throw new Error('OTP verification is required before resetting password');
    }

    // Set new password (the model's pre-save hook will automatically hash it)
    user.password = password;

    // Clear reset credentials
    user.resetOtp = undefined;
    user.resetOtpExpire = undefined;
    user.isResetOtpVerified = false;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  forgotPassword,
  verifyResetOtp,
  resetPassword
};
