require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const songRoutes = require('./routes/songs');
const recognizeRoutes = require('./routes/recognize');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(morgan('dev'));

// Database connection
mongoose.connect('mongodb+srv://vv520695:VJEpdtaXEO9gKbZa@cluster0.fhrsfl8.mongodb.net/')
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/songs', songRoutes);
app.use('/api/recognize', recognizeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});