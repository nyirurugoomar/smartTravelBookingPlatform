import React from 'react'
import { events } from '../assets/asset'
import Hero from '../components/Hero'


function Events() {
  return (
    <div className='flex flex-col gap-4 py-4'>
        <Hero/>
        <div className='flex flex-col gap-4 mt-10'>
        <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
            {events.map((event) => (
                <div key={event.id} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-500 p-4'>
                   <div className='flex flex-col gap-2'>
                   <img src={event.image} alt={event.name} className='w-full h-[200px] object-cover' />
                    <h3 className='text-2xl font-semibold'>{event.name}</h3>
                    <p className='text-sm text-gray-500 font-medium'>{event.date}</p>
                    <p className='text-sm text-gray-500 font-medium'>{event.location}</p>
                    <button className='bg-blue-500 text-white px-4 py-2 rounded-md'>Buy Ticket</button>
                   </div>
                </div>
            ))}
        </div>
        </div>
        
    </div>
  )
}

export default Events