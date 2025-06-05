import React from 'react'

function Hero() {
  return (
    <div className='flex flex-col md:flex-row flex-wrap justify-center items-center min-h-[400px] bg-[#5f6FFF] rounded-lg px-6 md:px-10 lg:px-20'>
    <div className='flex flex-col gap-4 items-center max-w-2xl'>
        <h1 className='text-white text-4xl font-bold text-center'>Welcome to our website</h1>
        <p className='text-white text-lg text-center'>Find the best deals on hotels, flights, trips, and events. Start your adventure today.</p>
        <div className='w-full max-w-4xl'>
            <div className='bg-white rounded-full shadow-lg p-2 flex items-center'>
                <div className='px-4 border-r'>
                    <select className='border-none focus:outline-none text-gray-600 bg-transparent'>
                        <option>Hotels</option>
                        <option>Flights</option>
                        <option>Trips</option>
                        <option>Events</option>
                    </select>
                </div>
                <div className='flex-1 px-4 border-r'>
                    <input 
                        type="text" 
                        placeholder="Where are you going?"
                        className='w-full border-none focus:outline-none text-gray-600'
                    />
                </div>
                <div className='flex-1 px-4'>
                    <input 
                        type="text" 
                        placeholder="Select dates"
                        className='w-full border-none focus:outline-none text-gray-600'
                    />
                </div>
                <button className='bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors ml-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            <div className='bg-white rounded-full shadow-lg p-2 flex items-center mt-2 hidden'>
                <div className='flex-1 px-4 border-r'>
                    <input 
                        type="text" 
                        placeholder="Event location"
                        className='w-full border-none focus:outline-none text-gray-600'
                    />
                </div>
                <div className='flex-1 px-4'>
                    <input 
                        type="text" 
                        placeholder="Event date"
                        className='w-full border-none focus:outline-none text-gray-600'
                    />
                </div>
                <button className='bg-blue-500 text-white cursor-pointer p-3 rounded-full hover:bg-blue-600 transition-colors ml-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</div>
  )
}

export default Hero