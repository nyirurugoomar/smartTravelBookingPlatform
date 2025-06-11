const express = require('express');
const router = express.Router();
const { getLiveFlights, searchFlights } = require('../controllers/flight.controller');
const { authenticateToken } = require('../middleware/auth');

// Get live flights (with optional filters) - Public endpoint
// Example: /api/flights/live?airline_iata=AA&dep_iata=JFK&arr_iata=LAX
router.get('/live', getLiveFlights);

// Search flights - Protected endpoint (requires login)
// Example: /api/flights/search?departureIata=JFK&arrivalIata=LAX&date=2024-03-20
router.get('/search', searchFlights);

module.exports = router; 