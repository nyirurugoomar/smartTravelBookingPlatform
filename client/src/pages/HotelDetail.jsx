import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { hotelApi } from '../api';
import Hero from '../components/Hero';
import Hotels from '../components/Hotels';

function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [guests, setGuests] = useState(1);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    const loadHotel = async () => {
      try {
        const data = await hotelApi.getById(id);
        console.log('Received hotel data:', data);
        setHotel(data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading hotel:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadHotel();
  }, [id]);

  const nextImage = () => {
    if (hotel?.images?.length) {
      setCurrentImageIndex((prev) => (prev + 1) % hotel.images.length);
    }
  };

  const prevImage = () => {
    if (hotel?.images?.length) {
      setCurrentImageIndex((prev) => (prev - 1 + hotel.images.length) % hotel.images.length);
    }
  };

  const calculateTotalPrice = () => {
    if (!selectedRoom || !checkIn || !checkOut) return null;
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    return selectedRoom.price * guests * nights;
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

  if (!hotel) {
    return (
      <div className="flex flex-col gap-4 py-4">
        <Hero />
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-gray-500">Hotel not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 py-4">
      <Hero />
      
      {/* Back button */}
      <button 
        onClick={() => navigate('/hotels')}
        className="flex items-center gap-2 text-primary hover:text-blue-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Hotels
      </button>

      {/* Hotel Name and Rating */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold">{hotel.name}</h1>
          <p className="text-gray-600 mt-2">
            {hotel.address?.city}, {hotel.address?.country}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
          <span className="text-primary font-bold">{hotel.rating}</span>
          <span className="text-primary">★</span>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative h-[500px] rounded-xl overflow-hidden">
        {hotel.images && hotel.images.length > 0 ? (
          <>
            <img
              src={hotel.images[currentImageIndex]}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
            {hotel.images.length > 1 && (
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
                  {hotel.images.map((_, index) => (
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

      {/* Hotel Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          {/* Description */}
          <div>
            <h2 className="text-4xl font-bold mb-4">About this hotel</h2>
            <p className="text-gray-600 leading-relaxed">{hotel.description}</p>
          </div>

          {/* Amenities */}
          {hotel.amenities && hotel.amenities.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {hotel.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {hotel.rooms && hotel.rooms.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Rooms</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {hotel.rooms.map((room, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <div className='flex flex-row items-center gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{room.type}</span>
                    </div>
                    <span>- Capacity: {room.capacity}</span>
                    <span>- Available: {room.available}</span>
                    <span>- Price: {room.price} Per night</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Location</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="font-medium">{hotel.address?.street}</p>
              <p className="text-gray-600">{hotel.address?.city}, {hotel.address?.country}</p>
              {hotel.address?.postalCode && (
                <p className="text-gray-600">Postal Code: {hotel.address.postalCode}</p>
              )}
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="md:col-span-1">
          <div className="sticky top-4 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Book This Hotel</h2>
            <div className="space-y-4">
              {/* Available Rooms Section */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Available Rooms</h3>
                <div className="space-y-3">
                  {hotel.rooms?.filter(room => room.available > 0).map((room, index) => (
                    <div 
                      key={index}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedRoom?.type === room.type 
                          ? 'border-primary bg-primary/5' 
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedRoom(room)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{room.type}</h4>
                          <p className="text-sm text-gray-600">Capacity: {room.capacity} guests</p>
                          <p className="text-sm text-gray-600">Available: {room.available} rooms</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">RWF {room.price?.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">per night</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!hotel.rooms || hotel.rooms.filter(room => room.available > 0).length === 0) && (
                    <p className="text-gray-500 text-center py-2">No rooms available at the moment</p>
                  )}
                </div>
              </div>

              {selectedRoom && (
                <>
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-semibold mb-2">Booking Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                        <input
                          type="date"
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                        <input
                          type="date"
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          min={checkIn || new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Number of Guests (Max: {selectedRoom.capacity})
                        </label>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setGuests(prev => Math.max(1, prev - 1))}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 disabled:opacity-50"
                            disabled={guests <= 1}
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{guests}</span>
                          <button 
                            onClick={() => setGuests(prev => prev + 1)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 disabled:opacity-50"
                            disabled={guests >= selectedRoom.capacity}
                          >
                            +
                          </button>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {selectedRoom.capacity - guests} guest{selectedRoom.capacity - guests !== 1 ? 's' : ''} remaining in this room
                        </p>
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">Price per night</span>
                          <span className="font-semibold">RWF {selectedRoom.price?.toLocaleString()}</span>
                        </div>
                        {checkIn && checkOut && (
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">Number of nights</span>
                            <span className="font-semibold">
                              {Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-gray-600">Total</span>
                          <span className="text-xl font-bold text-primary">
                            {checkIn && checkOut ? (
                              `RWF ${(selectedRoom.price * guests * Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)))?.toLocaleString()}`
                            ) : (
                              "Select dates"
                            )}
                          </span>
                        </div>
                        <button 
                          className="w-full bg-primary text-white py-3 rounded-full hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                          onClick={() => alert('Booking functionality coming soon!')}
                          disabled={!checkIn || !checkOut}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HotelDetail; 