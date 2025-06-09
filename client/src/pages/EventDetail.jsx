import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventApi } from '../api';
import Hero from '../components/Hero';
import { format } from 'date-fns';

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const data = await eventApi.getById(id);
        console.log('Received event data:', data);
        setEvent(data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading event:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  const nextImage = () => {
    if (event?.images?.length) {
      setCurrentImageIndex((prev) => (prev + 1) % event.images.length);
    }
  };

  const prevImage = () => {
    if (event?.images?.length) {
      setCurrentImageIndex((prev) => (prev - 1 + event.images.length) % event.images.length);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 py-4">
        <Hero />
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 py-4">
        <Hero />
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col gap-4 py-4">
        <Hero />
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-gray-500">Event not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 py-4">
      <Hero />
      
      {/* Back button */}
      <button 
        onClick={() => navigate('/events')}
        className="flex items-center gap-2 text-primary hover:text-blue-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Events
      </button>

      
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold">{event.name}</h1>
          <p className="text-gray-600 mt-2">
            {event.location || "Location not available"}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
          <span className="text-primary font-bold">
            {event.date ? format(new Date(event.date), "MMMM d, yyyy") : "Date not available"}
          </span>
        </div>
      </div>

      
      <div className="relative h-[500px] rounded-xl overflow-hidden">
        {event.images && event.images.length > 0 ? (
          <>
            <img
              src={event.images[currentImageIndex]}
              alt={event.name}
              className="w-full h-full object-cover"
            />
            {event.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {event.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">No images available</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="md:col-span-2 space-y-8">
          
          <div>
            <h2 className="text-4xl font-bold mb-4">About this event</h2>
            <p className="text-gray-600 leading-relaxed">{event.description}</p>
          </div>

          
          <div>
            <h2 className="text-2xl font-bold mb-4">Event Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span>Date: {event.date ? format(new Date(event.date), "MMMM d, yyyy") : "Not available"}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>Location: {event.location || "Not available"}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span>Organizer: {event.organizer || "Not available"}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>Category: {event.category || "Not available"}</span>
              </div>
            </div>
          </div>

          
          {event.additionalInfo && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Additional Information</h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-600">{event.additionalInfo}</p>
              </div>
            </div>
          )}
        </div>

        
        <div className="md:col-span-1">
          <div className="sticky top-4 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Book Tickets</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Tickets
                </label>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setGuests(prev => Math.max(1, prev - 1))}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{guests}</span>
                  <button 
                    onClick={() => setGuests(prev => prev + 1)}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Price per ticket</span>
                  <span className="font-semibold">RWF {event.price?.toLocaleString() || "Not available"}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Total</span>
                  <span className="text-xl font-bold text-primary">
                    RWF {(event.price * guests)?.toLocaleString() || "Not available"}
                  </span>
                </div>
                <button 
                  className="w-full bg-primary text-white py-3 rounded-full hover:bg-blue-600 transition-colors"
                  onClick={() => alert('Booking functionality coming soon!')}
                >
                  Buy Tickets
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetail;