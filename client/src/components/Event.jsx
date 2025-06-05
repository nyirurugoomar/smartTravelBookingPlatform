import React from "react";
import { events } from "../assets/asset";

function Event() {
  return (
    <div className="flex flex-col gap-4 py-4">
      <h1 className="text-2xl font-bold">Events</h1>
      <div className="container mx-auto">
        <div className="relative">
          <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex-none w-[300px] border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-500"
              >
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-[200px] object-cover"
                />
                <div className="flex flex-row gap-2 items-center justify-between px-2">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{event.name}</h3>
                    <p className="text-sm text-gray-500">{event.date}</p>
                    <p className="text-sm text-gray-500">{event.location}</p>
                  </div>
                  <div>
                    <button className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded-md">Buy Ticket</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Event;
