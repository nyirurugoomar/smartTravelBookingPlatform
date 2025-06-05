import React from 'react'
import Hero from '../components/Hero'
import { flights } from '../assets/asset'

function Flight() {
  return (
    <div className='flex flex-col gap-4 py-4'>
        <Hero/>
        <div className='flex flex-col gap-4 mt-10'>
            <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
                {flights.map((flight) => (
                    <div key={flight.id} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-500 p-4'>
                        <img src={flight.image} alt={flight.name} className='w-full h-[200px] object-cover' />
                        <h3 className='text-2xl font-semibold'>{flight.airline}</h3>
                        <p className='text-sm text-gray-500 font-medium'><span className='font-bold text-black'>From </span> {flight.departure.airport}</p>
                                <p className='text-sm text-gray-500 font-medium'><span className='font-bold text-black'>To </span>{flight.arrival.airport}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default Flight