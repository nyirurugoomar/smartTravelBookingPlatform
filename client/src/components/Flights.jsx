import React from 'react'
import { flights } from '../assets/asset'

function Flights() {
  return (
    <div className='flex flex-col gap-4 py-4'>
        <h1 className='text-2xl font-bold'>Flights</h1>
        <div className='container mx-auto'>
            <div className='relative'>
                <div className='flex overflow-x-auto gap-4 pb-4 scrollbar-hide'>
                    {flights.map((flight) => (
                        <div key={flight.id} className='flex-none w-[300px] border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-500'>
                            <img src={flight.image} alt={flight.name} className='w-full h-[200px] object-cover' />
                            <div className='p-4'>
                                <div>
                                <h3 className='text-lg font-semibold'>{flight.airline}</h3>
                                <p className='text-sm text-gray-500 font-medium'><span className='font-bold text-black'>From </span> {flight.departure.airport}</p>
                                <p className='text-sm text-gray-500 font-medium'><span className='font-bold text-black'>To </span>{flight.arrival.airport}</p>
                                
                                </div>
                                <div>
                                    <p><span className='font-bold text-black'>Price </span>{flight.price.amount} {flight.price.currency}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  )
}

export default Flights