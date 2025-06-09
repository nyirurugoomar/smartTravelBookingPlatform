import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import { tripApi } from '../api';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

function Trips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const data = await tripApi.getAll();
        console.log('Trips API Response:', JSON.stringify(data, null, 2));
       
        if (data && data.length > 0) {
          console.log('First trip image data:', {
            tripId: data[0]._id,
            images: data[0].images,
            imageType: typeof data[0].images,
            isArray: Array.isArray(data[0].images)
          });
        }
        setTrips(data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading trips:', err);
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
    <div className='flex flex-col gap-8 py-4'>
      <Hero />
      <h1 className="text-4xl font-bold">Available Trips{" "} <span className="text-primary">({trips.length})</span></h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip) => {
         
          console.log(`Trip ${trip._id} image data:`, {
            images: trip.images,
            imageType: typeof trip.images,
            isArray: Array.isArray(trip.images)
          });

         
          let imageUrl = "https://www.shutterstock.com/image-vector/no-image-picture-available-on-600nw-2450891049.jpg";
          if (trip.images) {
            if (Array.isArray(trip.images) && trip.images.length > 0) {
              imageUrl = trip.images[0];
            } else if (typeof trip.images === 'string') {
              imageUrl = trip.images;
            }
          }

          return (
            <div
              key={trip._id}
              onClick={() => navigate(`/trips/${trip._id}`)}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-500"
            >
              <img
                src={imageUrl}
                alt={trip.name || "Trip"}
                className="w-full h-[250px] object-cover"
                onError={(e) => {
                  console.error(`Failed to load image for trip ${trip._id}:`, imageUrl);
                  e.target.onerror = null;
                  e.target.src = "https://www.shutterstock.com/image-vector/no-image-picture-available-on-600nw-2450891049.jpg";
                }}
              />
              
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  {trip.name || "Unnamed Trip"}
                </h3>
                <div className="space-y-2 mb-4">
                  <p className="text-gray-600">
                    {trip.date ? format(new Date(trip.date), "MMMM d, yyyy") : "Date not available"}
                  </p>
                  <p className="text-gray-600">
                    {trip.location || "Location not available"}
                  </p>
                  <p className="text-gray-600">
                    Duration: {trip.duration || "Not specified"}
                  </p>
                  <p className="text-primary font-semibold">
                    RWF {trip.price?.toLocaleString() || "Price not available"}
                  </p>
                </div>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click when clicking button
                    navigate(`/trips/${trip._id}`);
                  }}
                  className="w-full cursor-pointer bg-primary text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors"
                >
                  Book Now
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Trips;