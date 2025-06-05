import React from 'react'
import { hotels } from '../assets/asset'

function Hotels() {
  return (
    <div className='flex flex-col gap-4 py-4 mt-10'>
        <h1 className='text-2xl font-bold'>Hotels</h1>
        <div className='container mx-auto'>
        <div className='relative'>
            <div className='flex overflow-x-auto gap-4 pb-4 '>
            {hotels.map((hotel) => (
                <div 
                key={hotel.id} 
                className='flex-none w-[300px] border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-500'
                >
                <img 
                    src={hotel.image} 
                    alt={hotel.name} 
                    className='w-full h-[200px] object-cover'
                />
                <div className='flex flex-row gap-2 items-center justify-around'>
                <div className='p-4'>
                    <h3 className='text-lg font-semibold'>{hotel.name}</h3>
                    <p className='text-sm text-gray-500'>{hotel.price}</p>
                </div>
                <div>
                    <button className='bg-blue-500 cursor-pointer text-white px-4 py-2 rounded-md'>Booking</button>
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

export default Hotels