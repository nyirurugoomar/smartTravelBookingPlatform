const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Get all bookings for the authenticated user
router.get('/my-bookings', bookingController.getUserBookings);

// Create a new booking
router.post('/', bookingController.createBooking);

// Update booking status
router.patch('/:bookingId/status', bookingController.updateBookingStatus);

// Get booking details
router.get('/:bookingId', bookingController.getBookingDetails);

module.exports = router; 