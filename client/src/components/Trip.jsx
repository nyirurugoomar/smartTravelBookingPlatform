import React from 'react'
import { trips } from '../assets/asset'

function Trip() {
  return (
    <div className="py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Trips</h1>
      <div className="grid grid-cols-4 grid-rows-2 gap-6 max-w-7xl mx-auto">
        {/* Main Card (big, spans 2x2) */}
        <div
          className="col-span-4 h-[500px] row-span-2 bg-cover bg-center rounded-3xl p-8 flex flex-col justify-end relative"
          style={{ backgroundImage: `url(${trips[0].image})` }}
        >
          <div className="absolute inset-0 bg-black/40 rounded-3xl"></div>
          <div className="relative z-10">
            <h3 className="text-white text-4xl font-extrabold mb-4">{trips[0,1].name}</h3>
            <p className="text-white text-xl mb-6">{trips[0].price}</p>
            <button className="bg-[#1fffc6] text-black font-bold px-6 py-2 rounded-full">Learn More</button>
          </div>
        </div>

        {/* Smaller Cards */}
        {trips.slice(1, 8).map((trip, idx) => (
          <div
          key={trip.id}
          className={`rounded-2xl p-6 flex flex-col justify-between bg-cover h-[300px] bg-center relative ${idx === 1 ? 'col-span-2' : ''}`}
          style={{ backgroundImage: `url(${trip.image})` }}
        >
          <div className="absolute inset-0 bg-black/20 rounded-2xl"></div>
          <div className="relative z-10 flex flex-col h-full">
            {/* Title at the top */}
            <h4 className="text-2xl font-extrabold mb-2 text-white">{trip.name}</h4>
            {/* Spacer to push content to bottom */}
            <div className="flex-1"></div>
            {/* Description and button at the bottom */}
            <div>
              <p className="mb-1 text-white">{trip.price}</p>
              <button className="bg-[#1fffc6] text-black font-bold px-6 py-2 rounded-full mt-2">Discover More</button>
            </div>
          </div>
        </div>
        ))}
      </div>
    </div>
  )
}

export default Trip