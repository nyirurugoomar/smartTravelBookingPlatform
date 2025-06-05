import React from 'react'
import Hero from '../components/Hero'
import { trips } from '../assets/asset'

function Trips() {
  return (
    <div className='flex flex-col gap-4 py-4'>
        <Hero/>
        <div className='flex flex-col gap-4 mt-10'>
            <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
                {trips.map((trip) => (
                    <div key={trip.id} style={{backgroundImage: `url(${trip.image})`}} className='h-[200px]  border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-500 p-4 bg-cover h'>
                        <div className='flex flex-col gap-2 items-center justify-between px-2'>
                            <div className='p-8 bg-black/50 rounded-xl w-full h-full mt-20'>
                                <h3 className='text-2xl font-semibold text-white'>{trip.name}</h3>
                                <p className='text-sm font-medium text-white'>{trip.price}</p>
                            </div>
                        </div>
                        
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default Trips