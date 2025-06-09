import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import { tripApi } from '../api';

function Trips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const data = await tripApi.getAll();
        console.log('Received trips data:', data); // Debug log
        setTrips(data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading trips:', err); // Debug log
        setError(err.message);
        setLoading(false);
      }
    };

    loadTrips();
  }, []);

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

  if (!trips || trips.length === 0) {
    return (
      <div className='flex flex-col gap-4 py-4'>
        <Hero />
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-gray-500">No trips available</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4 py-4'>
      <Hero />
      <div className='flex flex-col gap-4 mt-10'>
        <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
          {trips.map((trip) => (
            <div 
              key={trip._id} 
              style={{
                backgroundImage: `url(${trip.images || 'https://www.shutterstock.com/image-vector/no-image-picture-available-on-600nw-2450891049.jpg'})`
              }} 
              className='h-[200px] border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-500 p-4 bg-cover bg-center'
            >
              <div className='flex flex-col gap-2 items-center justify-between px-2'>
                <div className='p-8 bg-black/50 rounded-xl w-full h-full mt-20'>
                  <h3 className='text-2xl font-semibold text-white'>{trip.name || 'Trip'}</h3>
                  <p className='text-sm font-medium text-white'>
                    RWF {trip.price?.toLocaleString() || 'Price not available'}
                  </p>
                  <p className='text-sm font-medium text-white mt-2'>
                    {trip.location || 'Location not available'}
                  </p>
                  <p className='text-sm font-medium text-white'>
                    {trip.date ? new Date(trip.date).toLocaleDateString() : 'Date not available'}
                  </p>
                  <button className='mt-4 bg-[#1fffc6] text-black font-bold px-6 py-2 rounded-full hover:bg-[#1ae6b3] transition-colors'>
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

export default Trips;