const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse'); // Assuming this path is correct
const User = require('../models/User'); // Assuming this path is correct

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  // 1. Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // 2. Check for token in cookies (if you're using cookie-based authentication)
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // If no token found at all
  if (!token) {
    console.log('Protect middleware: No token found. Denying access.'); // Added log
    return next(new ErrorResponse('Not authorized to access this route (No token)', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Protect middleware: JWT decoded:', decoded); // Added log

    // Find user by ID from token payload
    const user = await User.findById(decoded.id);

    // *** CRITICAL FIX: Check if user was actually found in the database ***
    if (!user) {
      console.log('Protect middleware: User ID from token not found in database. Denying access.'); // Added log
      return next(new ErrorResponse('Not authorized to access this route (User not found)', 401));
    }

    // If user is found, attach it to the request object
    req.user = user;
    console.log(`Protect middleware: req.user populated for user: ${req.user.username || req.user.email}`); // Added log

    next(); // Proceed to the next middleware or controller
  } catch (err) {
    // This catch block handles errors like:
    // - JWT malformed
    // - JWT expired
    // - Invalid signature
    console.error('Protect middleware: JWT verification or user lookup failed:', err.message); // Added log
    return next(new ErrorResponse('Not authorized to access this route (Invalid token)', 401));
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Ensure req.user exists before accessing req.user.role
    if (!req.user || !req.user.role) {
      console.log('Authorize middleware: req.user or role missing.'); // Added log
      return next(
        new ErrorResponse(
          'Not authorized: User role could not be determined',
          403
        )
      );
    }

    if (!roles.includes(req.user.role)) {
      console.log(`Authorize middleware: User role ${req.user.role} not authorized.`); // Added log
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
