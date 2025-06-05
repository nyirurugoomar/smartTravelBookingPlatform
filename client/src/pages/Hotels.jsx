import React from 'react'
import { hotels } from '../assets/asset'
import Hero from '../components/Hero'

function Hotels() {
  return (
    <div className='flex flex-col gap-4 py-4'>
        <Hero/>
        <div className='flex flex-col gap-4 mt-10' >
            <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
                {hotels.map((hotel) => (
                    <div key={hotel.id} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-500 p-4'>
                        <img src={hotel.image} alt={hotel.name} className='w-full h-[200px] object-cover' />
                         <div className='flex flex-row gap-2 items-center justify-between'>
                            <div className='p-4'>
                                <h3 className='text-lg font-semibold'>{hotel.name}</h3>
                                <p className='text-sm text-gray-500 font-medium'>{hotel.price}</p>
                            </div>
                            <div>
                                <button className='bg-blue-500 text-white px-4 py-2 rounded-md'>Book Now</button>
                            </div>
                         </div>
                    </div>
                ))}
            </div>
        </div>

    </div>
  )
}

export default Hotels