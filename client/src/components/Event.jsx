import React, { useState, useEffect } from "react";
import { eventApi } from "../api";
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns';

function Event() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await eventApi.getAll();
        console.log("Received events data:", data);
        // Only show first 5 events in the home page
        setEvents(data.slice(0, 5));
        setLoading(false);
      } catch (err) {
        console.error("Error loading events:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 py-4">
        <h1 className="text-2xl font-bold">Events</h1>
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 py-4">
        <h1 className="text-2xl font-bold">Events</h1>
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="flex flex-col gap-4 py-4">
        <h1 className="text-2xl font-bold">Events</h1>
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-gray-500">No events available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <h1 className="text-2xl font-bold">Events{" "} <span className="text-primary">({events.length})</span></h1>
      <div className="container mx-auto">
        <div className="relative">
          <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
            {events.map((event) => (
              <div
                key={event._id}
                onClick={() => navigate(`/events/${event._id}`)}
                className="flex-none w-[300px] border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-500"
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
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src =
                      "https://www.shutterstock.com/image-vector/no-image-picture-available-on-600nw-2450891049.jpg";
                  }}
                />
                
                <div className="p-4">
                  <h3 className="text-sm font-semibold">
                    {event.name || "Unnamed Event"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {event.date ? format(new Date(event.date), "MMMM d, yyyy") : "Date not available"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {event.location || "Location not available"}
                  </p>
                  <p className="text-sm text-gray-500">
                    RWF {event.price?.toLocaleString() || "Price not available"}
                  </p>
                </div>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click when clicking button
                    navigate(`/events/${event._id}`);
                  }}
                  className="w-full cursor-pointer bg-blue-500 text-white px-6 py-4 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Buy Ticket
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Event;
