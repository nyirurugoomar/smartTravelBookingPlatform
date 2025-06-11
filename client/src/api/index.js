import axios from 'axios';

const api = axios.create({
    baseURL: 'https://smarttravelbookingplatform-backend.onrender.com/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;

// Named exports
export { default as eventApi } from './eventApi';
export { default as hotelApi } from './hotelApi';
export { default as tripApi } from './tripApi';

// Export specific methods
export { getUpcomingEvents, getPastEvents } from './eventApi';
export { searchHotels, getHotelsByPriceRange } from './hotelApi';
export { getFeaturedTrips, getTripsByDuration } from './tripApi'; 