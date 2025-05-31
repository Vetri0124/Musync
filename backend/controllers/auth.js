const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    const { username, email, password, confirmPassword } = req.body;

    // --- Basic Validation ---
    if (!username || !email || !password || !confirmPassword) {
        return next(new ErrorResponse('Please enter all required fields', 400));
    }

    if (password !== confirmPassword) {
        return next(new ErrorResponse('Passwords do not match', 400));
    }
    // --- End Basic Validation ---

    try {
        // Create user
        // The password hashing is handled by the pre('save') hook in your User model
        const user = await User.create({
            username,
            email,
            password
        });

        sendTokenResponse(user, 200, res);

    } catch (error) {
        // --- Specific Error Handling for Duplicate Key (E11000) ---
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            const message = `A user with that ${field} already exists. Please choose a different ${field}.`;
            return next(new ErrorResponse(message, 400));
        }

        // --- Handle Mongoose Validation Errors (e.g., invalid email format, minlength) ---
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return next(new ErrorResponse(messages.join(', '), 400));
        }

        // For any other unexpected errors, pass to your general error handling middleware
        console.error("Unexpected error during user registration:", error);
        return next(new ErrorResponse('Something went wrong during registration.', 500));
    }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).populate('favorites history.song');

    res.status(200).json({
        success: true,
        data: user
    });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    // --- CRITICAL FIX: Parse JWT_COOKIE_EXPIRE to an integer ---
    let cookieExpireDays = parseInt(process.env.JWT_COOKIE_EXPIRE, 10);

    // Add a fallback in case JWT_COOKIE_EXPIRE is missing or not a valid number
    if (isNaN(cookieExpireDays)) {
        console.warn("JWT_COOKIE_EXPIRE is not set or is not a valid number in your .env. Defaulting cookie expiry to 30 days.");
        cookieExpireDays = 30; // Default to 30 days if not properly configured
    }

    const options = {
        expires: new Date(
            Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000 // Calculation now uses a valid number
        ),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            }
        });
};