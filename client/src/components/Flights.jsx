import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getLiveFlights } from "../api/flightApi";
import Hero from "./Hero";

function Flights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadFlights = async () => {
      try {
        const filters = {
          airline_iata: searchParams.get("airline"),
          dep_iata: searchParams.get("from"),
          arr_iata: searchParams.get("to"),
          flight_status: searchParams.get("status"),
          in_air: searchParams.get("inAir"),
        };

        const response = await getLiveFlights(filters);
        console.log("Received flights data:", response.data);
        setFlights(response.data.flights);
        setLoading(false);
      } catch (err) {
        console.error("Error loading flights:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadFlights();
  }, [searchParams]);

  const handleBooking = (flightNumber) => {
    // Check if user is logged in (you can implement this check based on your auth system)
    const isLoggedIn = localStorage.getItem("token"); // or however you check login status

    if (!isLoggedIn) {
      // If not logged in, redirect to login page
      navigate("/login", { state: { from: `/flights/${flightNumber}` } });
      return;
    }

    // If logged in, proceed to booking
    navigate(`/flights/${flightNumber}`);
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

  return (
    <div className="flex flex-col gap-4 py-4">
     
     <h1 className="text-2xl font-bold text-start">Flights</h1>
      <div className="container mx-auto">
        <div className="relative">
          <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
            {flights.map((flight) => (
              <div
                key={flight.flightNumber}
                className="flex-none w-[350px] border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-500 p-4"
              >
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <h3 className="text-2xl font-semibold text-blue-800">
                    {flight.airline}
                  </h3>
                  <p className="text-lg font-medium text-blue-600">
                    {flight.flightNumber}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">From</p>
                      <p className="font-semibold">
                        {flight.departure.airport}
                      </p>
                      <p className="text-sm text-gray-600">
                        {flight.departure.iata}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-24 h-0.5 bg-blue-200"></div>
                      <p className="text-xs text-gray-500 mt-1">Flight</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">To</p>
                      <p className="font-semibold">{flight.arrival.airport}</p>
                      <p className="text-sm text-gray-600">
                        {flight.arrival.iata}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <p className="text-gray-500">Departure</p>
                      <p className="font-medium">
                        {new Date(
                          flight.departure.scheduled
                        ).toLocaleTimeString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Arrival</p>
                      <p className="font-medium">
                        {new Date(
                          flight.arrival.scheduled
                        ).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p
                        className={`font-medium ${
                          flight.status === "active"
                            ? "text-green-600"
                            : flight.status === "scheduled"
                            ? "text-blue-600"
                            : flight.status === "cancelled"
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        {flight.status}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-semibold text-blue-600">From $100</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBooking(flight.flightNumber)}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors mt-4"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Flights;
