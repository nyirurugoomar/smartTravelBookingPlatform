import { createApi } from './baseApi';

const hotelApi = createApi('hotels');

// Add any hotel-specific API methods here
export const searchHotels = async (query) => {
  const hotels = await hotelApi.getAll();
  const searchTerm = query.toLowerCase();
  return hotels.filter(hotel => 
    hotel.name.toLowerCase().includes(searchTerm) ||
    hotel.location.toLowerCase().includes(searchTerm) ||
    hotel.description.toLowerCase().includes(searchTerm)
  );
};

export const getHotelsByPriceRange = async (minPrice, maxPrice) => {
  const hotels = await hotelApi.getAll();
  return hotels.filter(hotel => 
    hotel.price >= minPrice && hotel.price <= maxPrice
  );
};

// Export the base CRUD operations
export default hotelApi; 