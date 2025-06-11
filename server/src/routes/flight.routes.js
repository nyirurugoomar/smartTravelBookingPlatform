const express = require('express');
const router = express.Router();
const { getLiveFlights, searchFlights } = require('../controllers/flight.controller');
const { authenticateToken } = require('../middleware/auth');

// Get live flights (with optional filters)
// Example: /api/flights/live?airline_iata=AA&dep_iata=JFK&arr_iata=LAX
router.get('/live', authenticateToken, getLiveFlights);

// Search flights
// Example: /api/flights/search?departureIata=JFK&arrivalIata=LAX&date=2024-03-20
router.get('/search', authenticateToken, searchFlights);

module.exports = router; 