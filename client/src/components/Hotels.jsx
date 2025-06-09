import React, { useState, useEffect } from "react";
import { hotelApi } from "../api";

function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadHotels = async () => {
      try {
        const data = await hotelApi.getAll();
        console.log("Received hotels data:", data); // Debug log
        setHotels(data);
        setLoading(false);
      } catch (err) {
        console.error("Error loading hotels:", err); // Debug log
        setError(err.message);
        setLoading(false);
      }
    };

    loadHotels();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 py-4">
        <h1 className="text-2xl font-bold">Hotels</h1>
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 py-4">
        <h1 className="text-2xl font-bold">Hotels</h1>
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!hotels || hotels.length === 0) {
    return (
      <div className="flex flex-col gap-4 py-4">
        <h1 className="text-2xl font-bold">Hotels</h1>
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-gray-500">No hotels available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4 mt-10">
      <h1 className="text-2xl font-bold">Hotels</h1>
      <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
        {hotels.map((hotel) => (
          <div
            key={hotel._id}
            style={{
              backgroundImage: `url(${
                Array.isArray(hotel.images) && hotel.images.length > 0
                  ? hotel.images[0]
                  : "https://www.shutterstock.com/image-vector/no-image-picture-available-on-600nw-2450891049.jpg"
              })`
            }}
            className="h-[300px] border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-500 p-4 bg-cover bg-center"
          >
            <div className="flex flex-col gap-2 items-center justify-between px-2 py-10">
              <div className="p-8 bg-black/50 rounded-xl w-full h-full mt-4">
                <h3 className="text-2xl font-semibold text-white">
                  {hotel.name || "Unnamed Hotel"}
                </h3>
                
                <p className="text-sm font-medium text-white mt-2">
                  {hotel.address?.city || "City not available"}, {hotel.address?.country || "Country not available"}
                </p>
                <p className="text-sm font-medium text-white">
                  {hotel.rating ? `${hotel.rating} ★` : "Rating not available"}
                </p>
                <button className="mt-4  bg-primary text- font-bold px-6 py-2 rounded-full hover:bg-blue-500 cursor-pointer transition-colors">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Hotels;
