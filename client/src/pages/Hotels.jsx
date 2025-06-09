import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import { hotelApi } from '../api';
import { useNavigate, useSearchParams } from 'react-router-dom';

function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const loadHotels = async () => {
      try {
        const data = await hotelApi.getAll();
        console.log('Received hotels data:', data);
        setHotels(data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading hotels:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadHotels();
  }, []);

  // Filter hotels based on search parameters
  useEffect(() => {
    const location = searchParams.get('location')?.toLowerCase();
    const dates = searchParams.get('dates');

    if (!location && !dates) {
      setFilteredHotels(hotels);
      return;
    }

    const filtered = hotels.filter(hotel => {
      const matchesLocation = !location || 
        (hotel.address?.city?.toLowerCase().includes(location) || 
         hotel.address?.country?.toLowerCase().includes(location));
      
      // Add date filtering logic here if needed
      // const matchesDates = !dates || ... 

      return matchesLocation;
    });

    setFilteredHotels(filtered);
  }, [hotels, searchParams]);

  if (loading) {
    return (
      <div className='flex flex-col gap-4 py-4'>
        <Hero />
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex flex-col gap-4 py-4'>
        <Hero />
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!filteredHotels || filteredHotels.length === 0) {
    return (
      <div className='flex flex-col gap-4 py-4'>
        <Hero />
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-gray-500">No hotels found matching your search criteria</p>
          <button 
            onClick={() => navigate('/hotels')}
            className="text-primary hover:text-blue-700 transition-colors"
          >
            Clear search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4 py-4'>
      <Hero />
      <div className='flex flex-col gap-4 mt-10'>
        {searchParams.toString() && (
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Search Results ({filteredHotels.length})
            </h2>
            <button 
              onClick={() => navigate('/hotels')}
              className="text-primary hover:text-blue-700 transition-colors"
            >
              Clear search
            </button>
          </div>
        )}
        <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
          {filteredHotels.map((hotel) => (
            <div 
              key={hotel._id} 
              onClick={() => navigate(`/hotels/${hotel._id}`)}
              style={{
                backgroundImage: `url(${
                  Array.isArray(hotel.images) && hotel.images.length > 0
                    ? hotel.images[0]
                    : "https://www.shutterstock.com/image-vector/no-image-picture-available-on-600nw-2450891049.jpg"
                })`
              }} 
              className="h-[300px] border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-500 p-4 bg-cover bg-center"
            >
              <div className="flex flex-col gap-2 items-center justify-between px-2 py-10">
                <div className="p-8 bg-black/50 rounded-xl w-full h-full mt-4">
                  <h3 className="text-2xl font-semibold text-white">
                    {hotel.name || "Unnamed Hotel"}
                  </h3>
                  <p className="text-sm font-medium text-white mt-2">
                    {hotel.address?.city || "City not available"}, {hotel.address?.country || "Country not available"}
                  </p>
                  <p className="text-sm font-medium text-white">
                    {hotel.rating ? `${hotel.rating} ★` : "Rating not available"}
                  </p>
                  <button className="mt-4 bg-primary text-white font-bold px-6 py-2 rounded-full hover:bg-blue-500 cursor-pointer transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Hotels;