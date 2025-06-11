const axios = require('axios');

const getLiveFlights = async (req, res) => {
  try {
    const apiKey = process.env.AVIATION_STACK_API;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const { airline_iata, flight_iata, dep_iata, arr_iata, flight_status, in_air } = req.query;

    const response = await axios.get('https://api.aviationstack.com/v1/flights', {
      params: {
        access_key: apiKey,
        limit: 100,
        airline_iata,
        flight_iata,
        dep_iata,
        arr_iata,
        flight_status
      }
    });

    // Format the flights data
    const flights = response.data.data.map(flight => ({
      flightNumber: flight.flight.iata,
      airline: flight.airline.name,
      departure: {
        airport: flight.departure.airport,
        iata: flight.departure.iata,
        scheduled: flight.departure.scheduled,
        terminal: flight.departure.terminal,
        gate: flight.departure.gate
      },
      arrival: {
        airport: flight.arrival.airport,
        iata: flight.arrival.iata,
        scheduled: flight.arrival.scheduled,
        terminal: flight.arrival.terminal,
        gate: flight.arrival.gate
      },
      status: flight.flight_status,
      live: flight.live
    }));

    // Filter for flights in air if requested
    const filteredFlights = in_air === 'true' 
      ? flights.filter(flight => flight.live && !flight.live.is_ground)
      : flights;

    res.json({
      success: true,
      count: filteredFlights.length,
      flights: filteredFlights
    });

  } catch (error) {
    console.error('Flight API Error:', error.message);
    res.status(500).json({
      error: 'Error fetching flights',
      message: error.response?.data?.error?.message || error.message
    });
  }
};

// Search flights with basic parameters
const searchFlights = async (req, res) => {
  try {
    const { departureIata, arrivalIata, date } = req.query;
    const apiKey = process.env.AVIATION_STACK_API;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    if (!departureIata || !arrivalIata || !date) {
      return res.status(400).json({
        error: 'Missing required parameters',
        required: ['departureIata', 'arrivalIata', 'date']
      });
    }

    const response = await axios.get('https://api.aviationstack.com/v1/flights', {
      params: {
        access_key: apiKey,
        dep_iata: departureIata,
        arr_iata: arrivalIata,
        flight_date: date
      }
    });

    const flights = response.data.data.map(flight => ({
      flightNumber: flight.flight.iata,
      airline: flight.airline.name,
      departure: {
        airport: flight.departure.airport,
        iata: flight.departure.iata,
        scheduled: flight.departure.scheduled,
        terminal: flight.departure.terminal,
        gate: flight.departure.gate
      },
      arrival: {
        airport: flight.arrival.airport,
        iata: flight.arrival.iata,
        scheduled: flight.arrival.scheduled,
        terminal: flight.arrival.terminal,
        gate: flight.arrival.gate
      },
      status: flight.flight_status,
      price: {
        economy: 100,
        business: 300,
        first: 500
      }
    }));

    res.json({
      success: true,
      count: flights.length,
      flights
    });

  } catch (error) {
    console.error('Flight Search Error:', error.message);
    res.status(500).json({
      error: 'Error searching flights',
      message: error.response?.data?.error?.message || error.message
    });
  }
};

// Get flight details by flight number
const getFlightDetails = async (req, res) => {
  try {
    const { flightNumber, date } = req.params;

    if (!flightNumber || !date) {
      return res.status(400).json({
        error: 'Missing required parameters',
        required: ['flightNumber', 'date']
      });
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        error: 'Invalid date format',
        message: 'Date must be in YYYY-MM-DD format'
      });
    }

    // Validate flight number format
    const flightNumberRegex = /^[A-Z0-9]{2,3}[0-9]{1,4}$/;
    if (!flightNumberRegex.test(flightNumber)) {
      return res.status(400).json({
        error: 'Invalid flight number format',
        message: 'Flight number must be in the format: AA123 or AAA1234'
      });
    }

    console.log('Getting flight details:', { flightNumber, date });

    const response = await axios.get('https://api.aviationstack.com/v1/flights', {
      params: {
        access_key: process.env.AVIATION_STACK_API,
        flight_iata: flightNumber,
        flight_date: date
      }
    });

    if (!response.data.data || response.data.data.length === 0) {
      return res.status(404).json({
        error: 'Flight not found',
        message: `No flight found with number ${flightNumber} on ${date}`
      });
    }

    const flight = response.data.data[0];
    const flightDetails = {
      flightNumber: flight.flight.iata,
      airline: {
        name: flight.airline.name,
        iata: flight.airline.iata
      },
      departure: {
        airport: flight.departure.airport,
        iata: flight.departure.iata,
        scheduled: flight.departure.scheduled,
        estimated: flight.departure.estimated,
        actual: flight.departure.actual,
        terminal: flight.departure.terminal,
        gate: flight.departure.gate,
        delay: flight.departure.delay
      },
      arrival: {
        airport: flight.arrival.airport,
        iata: flight.arrival.iata,
        scheduled: flight.arrival.scheduled,
        estimated: flight.arrival.estimated,
        actual: flight.arrival.actual,
        terminal: flight.arrival.terminal,
        gate: flight.arrival.gate,
        delay: flight.arrival.delay
      },
      status: flight.flight_status,
      aircraft: {
        registration: flight.aircraft?.registration || 'Unknown',
        type: flight.aircraft?.type || 'Unknown'
      },
      live: flight.live || null
    };

    res.json({
      success: true,
      flight: flightDetails
    });

  } catch (error) {
    console.error('Error getting flight details:', {
      message: error.message,
      response: error.response?.data
    });

    if (error.response?.status === 401) {
      return res.status(500).json({
        error: 'API authentication failed',
        message: 'Please check your Aviation Stack API key'
      });
    }

    if (error.response?.status === 429) {
      return res.status(429).json({
        error: 'API rate limit exceeded',
        message: 'Please try again later'
      });
    }

    res.status(500).json({
      error: 'Error getting flight details',
      message: error.message
    });
  }
};

module.exports = {
  getLiveFlights,
  searchFlights,
  getFlightDetails
}; 