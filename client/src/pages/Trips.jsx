import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import { tripApi } from '../api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';

function Trips() {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const data = await tripApi.getAll();
        console.log('Received trips data:', data);
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

  // Filter trips based on search parameters
  useEffect(() => {
    const location = searchParams.get('location')?.toLowerCase().trim();
    const dates = searchParams.get('dates');
    const guests = searchParams.get('guests');

    console.log('Search parameters:', { location, dates, guests });

    if (!location && !dates && !guests) {
      console.log('No search parameters, showing all trips');
      setFilteredTrips(trips);
      return;
    }

    const filtered = trips.filter(trip => {
      // Log each trip's data for debugging
      console.log('Checking trip:', {
        id: trip._id,
      name: trip.name,
      location: trip.location,
      capacity: trip.capacity,
      date: trip.date
      });

      let matchesLocation = false;
      if (location) {
        const locationMatch = trip.location?.toLowerCase().includes(location);
      const nameMatch = trip.name?.toLowerCase().includes(location);
      const activitiesMatch = trip.activities?.toLowerCase().includes(location);
        matchesLocation = locationMatch || nameMatch || activitiesMatch;
        
        console.log('Location match for trip', trip._id, ':', {
          location,
          locationMatch,
          nameMatch,
          activitiesMatch,
          matchesLocation
        });
      } else {
        matchesLocation = true;
      }
      
      let matchesGuests = false;
      if (guests) {
        const tripCapacity = parseInt(trip.capacity) || 0;
        const requestedGuests = parseInt(guests) || 0;
        matchesGuests = tripCapacity >= requestedGuests;
        
        console.log('Guest match for trip', trip._id, ':', {
          tripCapacity,
          requestedGuests,
          matchesGuests
        });
      } else {
        matchesGuests = true;
      }

      let matchesDates = false;
    if (dates) {
      const searchDate = new Date(dates);
      const tripDate = new Date(trip.date);
      // Check if trip date is on or after the search date
      matchesDates = tripDate >= searchDate;
      
      console.log('Date match for trip', trip._id, ':', {
        searchDate: searchDate.toISOString(),
        tripDate: tripDate.toISOString(),
        matchesDates
      });
    } else {
      matchesDates = true;
    }
    

      const matches = matchesLocation && matchesGuests && matchesDates;
      console.log('Final match for trip', trip._id, ':', matches);
      
      return matches;
    });

    console.log('Filtered trips:', filtered);
    setFilteredTrips(filtered);
  }, [trips, searchParams]);

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

  if (!filteredTrips || filteredTrips.length === 0) {
    return (
      <div className='flex flex-col gap-4 py-4'>
        <Hero />
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-gray-500">No trips found matching your search criteria</p>
          <button 
            onClick={() => navigate('/trips')}
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
  <div className="flex items-center justify-between mb-4">
    <div>
      <h2 className="text-xl font-semibold">
        Search Results ({filteredTrips.length})
      </h2>
      {searchParams.get('location') && (
        <p className="text-sm text-gray-600">
          Trips matching "{searchParams.get('location')}"
        </p>
      )}
      {searchParams.get('guests') && (
        <p className="text-sm text-gray-600">
          for {searchParams.get('guests')} guests
        </p>
      )}
    </div>
    <button 
      onClick={() => navigate('/trips')}
      className="text-primary hover:text-blue-700 transition-colors"
    >
      Clear search
    </button>
  </div>
)}
        <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 gap-y-6'>
          {filteredTrips.map((trip) => (
            <div 
              key={trip._id} 
              onClick={() => navigate(`/trips/${trip._id}`)}
              style={{
                backgroundImage: `url(${
                  trip.images || 
                  "https://www.shutterstock.com/image-vector/no-image-picture-available-on-600nw-2450891049.jpg"
                })`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }} 
              className="h-[300px] border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-500 p-4 relative"
            >
              <div className="absolute inset-0 bg-black/50 rounded-xl"></div>
              <div className="flex flex-col gap-2 items-center justify-between px-2 py-10 h-full relative z-10">
                <div className="p-8 bg-black/50 rounded-xl w-full h-full mt-4">
                  <h3 className="text-2xl font-semibold text-white">
                    {trip.name || "Unnamed Trip"}
                  </h3>
                  <p className="text-sm font-medium text-white">
                    {trip.location || "Location not available"}
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

export default Trips;