import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Hero from '../components/Hero';
import { format } from 'date-fns';

function Myprofile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('bookings');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) {
          navigate('/login');
          return;
        }
        setUser(userData);

        // Fetch user's bookings
        const response = await api.get('/bookings/my-bookings');
        console.log('Fetched bookings:', response.data);
        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading profile data:', err);
        setError(err.response?.data?.message || 'Error loading profile data');
        setLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'failed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getItemTypeLabel = (type) => {
    switch (type?.toLowerCase()) {
      case 'event':
        return 'Event';
      case 'trip':
        return 'Trip';
      case 'hotel':
        return 'Hotel';
      default:
        return type;
    }
  };

  const getItemImage = (booking) => {
    if (booking.itemDetails?.images?.[0]) {
      return booking.itemDetails.images[0];
    }
    // Return a default image based on item type
    switch (booking.itemType?.toLowerCase()) {
      case 'hotel':
        return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3';
      case 'event':
        return 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3';
      case 'trip':
        return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3';
      default:
        return 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 py-4">
        <Hero />
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5f6FFF]"></div>
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

  return (
    <div className="flex flex-col gap-8 py-4">
      <Hero />
      
      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Welcome Again, {user?.firstName} {user?.lastName}</h1>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-gray-600">{user?.phoneNumber}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'bookings'
                ? 'bg-[#5f6FFF] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            My Bookings
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'profile'
                ? 'bg-[#5f6FFF] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Profile Settings
          </button>
        </div>

        {/* Content */}
        {activeTab === 'bookings' ? (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Booking History</h2>
            {bookings.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg shadow-md">
                <p className="text-gray-500">No bookings found</p>
                <button
                  onClick={() => navigate('/hotels')}
                  className="mt-4 px-4 py-2 bg-[#5f6FFF] text-white rounded-lg hover:bg-[#4f5fef] transition-colors"
                >
                  Start Booking
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="md:flex">
                      {/* Image Section */}
                      <div className="md:w-1/3">
                        <img
                          src={getItemImage(booking)}
                          alt={booking.itemDetails?.name || 'Booking item'}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>

                      {/* Details Section */}
                      <div className="p-6 md:w-2/3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800">
                              {booking.itemDetails?.name || 'Item Name Not Available'}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {getItemTypeLabel(booking.itemType)} Booking
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Booking Date:</span>{' '}
                              {format(new Date(booking.createdAt), 'MMMM d, yyyy')}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Amount:</span>{' '}
                              {booking.amount?.toLocaleString()} {booking.currency?.toUpperCase()}
                            </p>
                            {booking.itemDetails?.location && (
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Location:</span>{' '}
                                {booking.itemDetails.location}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            {booking.itemType === 'hotel' && booking.bookingDetails && (
                              <>
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Check-in:</span>{' '}
                                  {format(new Date(booking.bookingDetails.checkIn), 'MMMM d, yyyy')}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Check-out:</span>{' '}
                                  {format(new Date(booking.bookingDetails.checkOut), 'MMMM d, yyyy')}
                                </p>
                                {booking.bookingDetails.roomType && (
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Room Type:</span>{' '}
                                    {booking.bookingDetails.roomType}
                                  </p>
                                )}
                              </>
                            )}
                            {booking.itemType === 'event' && booking.bookingDetails && (
                              <>
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Event Date:</span>{' '}
                                  {format(new Date(booking.bookingDetails.eventDate), 'MMMM d, yyyy')}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Guests:</span>{' '}
                                  {booking.bookingDetails.guests}
                                </p>
                              </>
                            )}
                            {booking.itemType === 'trip' && booking.bookingDetails && (
                              <>
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Trip Date:</span>{' '}
                                  {format(new Date(booking.bookingDetails.tripDate), 'MMMM d, yyyy')}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Guests:</span>{' '}
                                  {booking.bookingDetails.numberOfGuests}
                                </p>
                              </>
                            )}
                          </div>
                        </div>

                        {booking.itemDetails?.description && (
                          <p className="mt-4 text-sm text-gray-600 line-clamp-2">
                            {booking.itemDetails.description}
                          </p>
                        )}

                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() => navigate(`/${booking.itemType}s/${booking.itemId}`)}
                            className="text-[#5f6FFF] hover:text-[#4f5fef] text-sm font-medium"
                          >
                            View Details →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Settings</h2>
            <p className="text-gray-600">Profile settings coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Myprofile;