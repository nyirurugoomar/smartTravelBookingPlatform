import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFlightDetails } from '../api/flightApi';
import Hero from '../components/Hero';
import PaymentForm from '../components/PaymentForm';

function FlightDetail() {
  const { flightNumber } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState('economy');
  const [passengers, setPassengers] = useState(1);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    const loadFlight = async () => {
      try {
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        const response = await getFlightDetails(flightNumber, today);
        console.log('Received flight data:', response.data);
        setFlight(response.data.flight);
        setLoading(false);
      } catch (err) {
        console.error('Error loading flight:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadFlight();
  }, [flightNumber]);

  const getClassPrice = (flightClass) => {
    const basePrice = 100; // Base price in USD
    switch (flightClass) {
      case 'economy':
        return basePrice;
      case 'business':
        return basePrice * 3;
      case 'first':
        return basePrice * 5;
      default:
        return basePrice;
    }
  };

  const calculateTotalPrice = () => {
    return getClassPrice(selectedClass) * passengers;
  };

  const handlePaymentSuccess = () => {
    navigate('/payment-success');
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

  if (!flight) {
    return (
      <div className="flex flex-col gap-4 py-4">
        <Hero />
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-gray-500">Flight not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <Hero />
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Flight Details */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{flight.airline.name}</h1>
                  <p className="text-lg text-gray-600">Flight {flight.flightNumber}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  flight.status === 'active' ? 'bg-green-100 text-green-800' :
                  flight.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                  flight.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {flight.status}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">From</p>
                  <p className="font-semibold">{flight.departure.airport}</p>
                  <p className="text-sm text-gray-600">{flight.departure.iata}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(flight.departure.scheduled).toLocaleString()}
                  </p>
                  {flight.departure.terminal && (
                    <p className="text-sm text-gray-600">Terminal {flight.departure.terminal}</p>
                  )}
                  {flight.departure.gate && (
                    <p className="text-sm text-gray-600">Gate {flight.departure.gate}</p>
                  )}
                </div>

                <div className="flex flex-col items-center justify-center">
                  <div className="w-24 h-0.5 bg-blue-200"></div>
                  <p className="text-xs text-gray-500 mt-1">Flight</p>
                  <p className="text-sm text-gray-600">
                    {flight.aircraft?.type || 'Aircraft info not available'}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500">To</p>
                  <p className="font-semibold">{flight.arrival.airport}</p>
                  <p className="text-sm text-gray-600">{flight.arrival.iata}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(flight.arrival.scheduled).toLocaleString()}
                  </p>
                  {flight.arrival.terminal && (
                    <p className="text-sm text-gray-600">Terminal {flight.arrival.terminal}</p>
                  )}
                  {flight.arrival.gate && (
                    <p className="text-sm text-gray-600">Gate {flight.arrival.gate}</p>
                  )}
                </div>
              </div>

              {flight.live && (
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-blue-800 mb-2">Live Flight Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Altitude</p>
                      <p className="font-medium">{flight.live.altitude} ft</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Speed</p>
                      <p className="font-medium">{flight.live.speed} km/h</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Heading</p>
                      <p className="font-medium">{flight.live.heading}°</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="font-medium">{flight.live.is_ground ? 'On Ground' : 'In Air'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Booking Section */}
          <div className="md:col-span-1">
            <div className="sticky top-4 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Book This Flight</h2>
              <div className="space-y-4">
                {/* Class Selection */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Select Class</h3>
                  <div className="space-y-3">
                    {['economy', 'business', 'first'].map((flightClass) => (
                      <div
                        key={flightClass}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedClass === flightClass
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-200'
                        }`}
                        onClick={() => setSelectedClass(flightClass)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium capitalize">{flightClass}</h4>
                            <p className="text-sm text-gray-600">
                              {flightClass === 'economy' ? 'Standard seating' :
                               flightClass === 'business' ? 'Premium seating with extra legroom' :
                               'Luxury seating with full service'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-blue-600">
                              ${getClassPrice(flightClass)}
                            </p>
                            <p className="text-sm text-gray-600">per passenger</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Passenger Selection */}
                <div className="pt-4 border-t">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Passengers
                  </label>
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Passenger' : 'Passengers'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Summary */}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Price per passenger</span>
                    <span className="font-semibold">${getClassPrice(selectedClass)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">Total</span>
                    <span className="text-xl font-bold text-blue-600">
                      ${calculateTotalPrice()}
                    </span>
                  </div>
                  <button
                    className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
                    onClick={() => setShowPayment(true)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showPayment && (
          <div className="max-w-2xl mx-auto mt-8">
            <PaymentForm
              amount={calculateTotalPrice()}
              itemType="flight"
              itemId={flight.flightNumber}
              metadata={{
                flightClass: selectedClass,
                passengers,
                airline: flight.airline.name,
                departure: flight.departure.airport,
                arrival: flight.arrival.airport,
                departureTime: flight.departure.scheduled,
                arrivalTime: flight.arrival.scheduled
              }}
              onSuccess={handlePaymentSuccess}
              onCancel={() => setShowPayment(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default FlightDetail; 