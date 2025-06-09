import { createApi } from './baseApi';

const tripApi = createApi('trips');

// Add any trip-specific API methods here
export const getFeaturedTrips = async () => {
  const trips = await tripApi.getAll();
  // You can implement your own logic for featured trips
  return trips.slice(0, 3); // For now, just return first 3 trips
};

export const getTripsByDuration = async (minDays, maxDays) => {
  const trips = await tripApi.getAll();
  return trips.filter(trip => {
    const duration = trip.duration || 0; // Assuming duration is in days
    return duration >= minDays && duration <= maxDays;
  });
};

export const getTripById = async (id) => {
  const trip = await tripApi.getById(id);
  return trip;
};

// Export the base CRUD operations
export default tripApi; 