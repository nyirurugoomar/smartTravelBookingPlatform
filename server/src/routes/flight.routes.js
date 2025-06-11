const express = require('express');
const router = express.Router();
const { getLiveFlights, searchFlights, getFlightDetails } = require('../controllers/flight.controller');
const { authenticateToken } = require('../middleware/auth');

// Get flight details by flight number and date - Public endpoint
// Example: /api/flights/AA123/2024-03-20
router.get('/:flightNumber/:date', getFlightDetails);

// Get live flights (with optional filters) - Public endpoint
// Example: /api/flights/live?airline_iata=AA&dep_iata=JFK&arr_iata=LAX
router.get('/live', getLiveFlights);

// Search flights - Protected endpoint (requires login)
// Example: /api/flights/search?departureIata=JFK&arrivalIata=LAX&date=2024-03-20
router.get('/search', authenticateToken, searchFlights);

module.exports = router; 