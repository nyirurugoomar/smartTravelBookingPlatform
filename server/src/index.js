// src/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const eventRoutes = require('./routes/event.routes');
const hotelRoutes = require('./routes/hotel.routes');
const tripRoutes = require('./routes/trip.routes');
const paymentRoutes = require('./routes/paymentRoutes');
const authRoutes = require('./routes/auth.routes');

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'https://smart-travel-booking-platform.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// IMPORTANT: Stripe webhook needs raw body parsing
// This must come before any other body parsing middleware
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }));

// Regular body parsing middleware for all other routes
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/payments', paymentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

module.exports = app;
