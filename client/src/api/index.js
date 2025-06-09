export { default as eventApi } from './eventApi';
export { default as hotelApi } from './hotelApi';
export { default as tripApi } from './tripApi';

// Export specific methods
export { getUpcomingEvents, getPastEvents } from './eventApi';
export { searchHotels, getHotelsByPriceRange } from './hotelApi';
export { getFeaturedTrips, getTripsByDuration } from './tripApi'; 