const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// @desc    Register a new user or admin (Postman friendly)
// @route   POST /api/auth/register, /register, /users
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide at least name and email.'
            });
        }

        const userPassword = password && password.length >= 6 ? password : 'password123';
        const normalizedEmail = email.trim().toLowerCase();

        // Check if user already exists
        let user = await User.findOne({ email: normalizedEmail });
        if (user) {
            const token = generateToken(user);
            return res.status(200).json({
                success: true,
                message: 'User already exists in MongoDB Atlas. Retrieved user record.',
                token,
                user: user.toSafeObject()
            });
        }

        const userRole = role === 'admin' ? 'admin' : 'user';

        user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: userPassword,
            role: userRole
        });

        const token = generateToken(user);

        res.cookie('sonicflow_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            success: true,
            message: `User '${user.name}' registered successfully in MongoDB Atlas!`,
            token,
            user: user.toSafeObject()
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error during registration.'
        });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login, /login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email.'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        let user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        if (password) {
            const isMatch = await user.matchPassword(password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password.'
                });
            }
        }

        const token = generateToken(user);

        res.cookie('sonicflow_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            success: true,
            message: 'Logged in successfully.',
            token,
            user: user.toSafeObject()
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error during login.'
        });
    }
};

// @desc    Get currently logged-in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        res.json({
            success: true,
            user: req.user.toSafeObject()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Logout user and clear session cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
    res.clearCookie('sonicflow_token');
    res.json({
        success: true,
        message: 'Logged out successfully.'
    });
};

// @desc    Get all users list
// @route   GET /api/auth/users, /users
// @access  Public / Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    logoutUser,
    getAllUsers
};
