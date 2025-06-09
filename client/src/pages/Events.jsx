import React, { useState, useEffect } from 'react'
import Hero from '../components/Hero'
import { eventApi } from '../api'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { format } from 'date-fns'

function Events() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await eventApi.getAll();
        console.log('Received events data:', data);
        setEvents(data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading events:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Filter events based on search parameters
  useEffect(() => {
    const location = searchParams.get('location')?.toLowerCase();
    const dates = searchParams.get('dates');
    const guests = searchParams.get('guests');

    if (!location && !dates && !guests) {
      setFilteredEvents(events);
      return;
    }

    const filtered = events.filter(event => {
      const matchesLocation = !location || 
        (event.location?.toLowerCase().includes(location) || 
         event.venue?.toLowerCase().includes(location));
      
      const matchesGuests = !guests || 
        (event.capacity && parseInt(event.capacity) >= parseInt(guests));

      // Add date filtering logic here if needed
      // const matchesDates = !dates || ... 

      return matchesLocation && matchesGuests;
    });

    setFilteredEvents(filtered);
  }, [events, searchParams]);

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

  if (!filteredEvents || filteredEvents.length === 0) {
    return (
      <div className='flex flex-col gap-4 py-4'>
        <Hero />
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-gray-500">No events found matching your search criteria</p>
          <button 
            onClick={() => navigate('/events')}
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
              Search Results ({filteredEvents.length})
            </h2>
            <button 
              onClick={() => navigate('/events')}
              className="text-primary hover:text-blue-700 transition-colors"
            >
              Clear search
            </button>
          </div>
        )}
        <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-6'>
          {filteredEvents.map((event) => (
            <div 
              key={event._id} 
              onClick={() => navigate(`/events/${event._id}`)}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-500"
            >
              <img
                src={
                  Array.isArray(event.images) && event.images.length > 0
                    ? event.images[0]
                    : "https://www.shutterstock.com/image-vector/no-image-picture-available-on-600nw-2450891049.jpg"
                }
                alt={event.name || "Event"}
                className="w-full h-[200px] object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://www.shutterstock.com/image-vector/no-image-picture-available-on-600nw-2450891049.jpg";
                }}
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {event.name || "Unnamed Event"}
                </h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Date:</span> {event.date ? format(new Date(event.date), "MMMM d, yyyy") : "Not available"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Location:</span> {event.location || "Not available"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Venue:</span> {event.venue || "Not available"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Price:</span> RWF {event.price?.toLocaleString() || "Not available"}
                  </p>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/events/${event._id}`);
                  }}
                  className="w-full mt-4 bg-primary text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Buy Ticket
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Events;