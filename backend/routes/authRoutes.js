const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getMe,
    logoutUser,
    getAllUsers
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// @route   POST /api/auth/register
router.post('/register', registerUser);

// @route   POST /api/auth/login
router.post('/login', loginUser);

// @route   GET /api/auth/me
router.get('/me', protect, getMe);

// @route   POST /api/auth/logout
router.post('/logout', logoutUser);

// @route   GET /api/auth/users
router.get('/users', getAllUsers);

// Direct root handling (when mounted as /users)
router.get('/', getAllUsers);

module.exports = router;
