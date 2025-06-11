import api from './axios';

// Get live flights with optional filters
export const getLiveFlights = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) queryParams.append(key, value);
  });
  return api.get(`/flights/live?${queryParams.toString()}`);
};

// Search flights
export const searchFlights = async (params) => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) queryParams.append(key, value);
  });
  return api.get(`/flights/search?${queryParams.toString()}`);
};

// Get flight details by flight number and date
export const getFlightDetails = async (flightNumber, date) => {
  return api.get(`/flights/${flightNumber}/${date}`);
};

const flightApi = {
  getLiveFlights,
  searchFlights,
  getFlightDetails
};

export default flightApi; 