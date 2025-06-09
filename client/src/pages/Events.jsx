import React, { useState, useEffect } from 'react'
import Hero from '../components/Hero'
import { eventApi } from '../api'
import { useNavigate } from 'react-router-dom'

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  if (!events || events.length === 0) {
    return (
      <div className='flex flex-col gap-4 py-4'>
        <Hero />
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-gray-500">No events available</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4 py-4'>
      <Hero />
      <div className='flex flex-col gap-4 mt-10'>
        <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {events.map((event) => (
            <div
              key={event._id}
              onClick={() => navigate(`/events/${event._id}`)}
              className="border border-blue-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
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
                  e.target.src =
                    "https://www.shutterstock.com/image-vector/no-image-picture-available-on-600nw-2450891049.jpg";
                }}
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">
                  {event.name || "Unnamed Event"}
                </h3>
                <div className="space-y-1 mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Date:</span>{" "}
                    {event.date ? new Date(event.date).toLocaleDateString() : "Not available"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Time:</span> {event.time || "Not available"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Location:</span>{" "}
                    {event.location || "Not available"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Price:</span> RWF{" "}
                    {event.price?.toLocaleString() || "Not available"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Capacity:</span>{" "}
                    {event.capacity?.toLocaleString() || "Not available"} people
                  </p>
                </div>
                <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                  Book Now
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