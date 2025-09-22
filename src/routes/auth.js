const express = require('express');
const router = express.Router();
const { register, login, getMe, logout, refreshToken, logoutAll } = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const { ensureDBConnection } = require('../middleware/dbConnection');


/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', ensureDBConnection, validateRegistration, register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', ensureDBConnection, validateLogin, login);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, getMe);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', auth, logout);

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post('/refresh', refreshToken);

// @route   POST /api/auth/logout-all
// @desc    Logout from all devices
// @access  Private
router.post('/logout-all', auth, logoutAll);

module.exports = router;
