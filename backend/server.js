require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');
const path = require('path');

const ErrorResponse = require('./utils/errorResponse');
const authRoutes = require('./routes/auth');
const songRoutes = require('./routes/songs');
const recognizeRoutes = require('./routes/recognize');

const app = express();

// Middleware
app.use(cors());
// --- Critical for Debugging: Add debug: true ---
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/' // Or './tmp/' for a local folder, or a specific path like 'C:/temp' on Windows
})); // <-- ADDED debug: true
app.use(express.json());
app.use(morgan('dev'));

// Database connection
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://vv520695:VJEpdtaXEO9gKbZa@cluster0.fhrsfl8.mongodb.net/')
  .then(() => console.log('MongoDB connected...'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/recognize', recognizeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    console.error(err.stack);

    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new ErrorResponse(message, 400);
    }

    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(messages.join(', '), 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Backend server is fully started and ready to receive requests!');
});

process.on('unhandledRejection', (err, promise) => {
    console.error(`Unhandled Rejection Error: ${err.message}`);
    process.exit(1);
});
