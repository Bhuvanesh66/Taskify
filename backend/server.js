/**
 * Main server file for the Taskify application
 * Sets up Express server with middleware, routes, and error handling
 */

// Import required dependencies
const express = require('express');       // Web framework for Node.js
const mongoose = require('mongoose');     // MongoDB object modeling
const cors = require('cors');            // Enable Cross-Origin Resource Sharing
const morgan = require('morgan');         // HTTP request logger
const rateLimit = require('express-rate-limit');  // Rate limiting middleware
const helmet = require('helmet');         // Security headers middleware
const mongoSanitize = require('express-mongo-sanitize');  // Prevent NoSQL injection
const xss = require('xss-clean');        // Prevent XSS attacks
require('dotenv').config();              // Load environment variables

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX || 100
});
app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization
app.use(mongoSanitize());
app.use(xss());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);

// Error handling middleware
app.use(errorHandler);

// Handle unhandled routes
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Cannot find ${req.originalUrl} on this server!`
  });
});

// DB connection + Server start
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    const port = process.env.PORT || 5000;
    const server = app.listen(port, () =>
      console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${port}`)
    );

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${port} is already in use`);
      } else {
        console.error('❌ Server error:', error.message);
      }
      process.exit(1);
    });
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

start();
