import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Hero() {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState('Hotels');
  const [searchParams, setSearchParams] = useState({
    location: '',
    dates: '',
    guests: ''
  });

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Navigate to the appropriate page with search parameters
    switch(selectedSection) {
      case 'Hotels':
        navigate(`/hotels?location=${searchParams.location}&dates=${searchParams.dates}`);
        break;
      case 'Events':
        navigate(`/events?location=${searchParams.location}&dates=${searchParams.dates}&guests=${searchParams.guests}`);
        break;
      case 'Trips':
        navigate(`/trips?location=${searchParams.location}&dates=${searchParams.dates}&guests=${searchParams.guests}`);
        break;
      default:
        navigate('/');
    }
  };

  const renderSearchFields = () => {
    switch(selectedSection) {
      case 'Hotels':
        return (
          <div className='bg-white rounded-full shadow-lg p-2 flex items-center'>
            <div className='px-4 border-r'>
              <select 
                className='border-none focus:outline-none text-gray-600 bg-transparent'
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <option value="Hotels">Hotels</option>
                <option value="Events">Events</option>
                <option value="Trips">Trips</option>
              </select>
            </div>
            <div className='flex-1 px-4 border-r'>
              <input 
                type="text" 
                placeholder="Where are you going?"
                className='w-full border-none focus:outline-none text-gray-600'
                value={searchParams.location}
                onChange={(e) => setSearchParams({...searchParams, location: e.target.value})}
              />
            </div>
            <div className='flex-1 px-4'>
              <input 
                type="date" 
                placeholder="Select dates"
                className='w-full border-none focus:outline-none text-gray-600'
                value={searchParams.dates}
                onChange={(e) => setSearchParams({...searchParams, dates: e.target.value})}
              />
            </div>
            <button 
              type="submit"
              className='bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors ml-2'
              onClick={handleSearch}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        );

      case 'Events':
        return (
          <div className='bg-white rounded-full shadow-lg p-2 flex items-center'>
            <div className='px-4 border-r'>
              <select 
                className='border-none focus:outline-none text-gray-600 bg-transparent'
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <option value="Hotels">Hotels</option>
                <option value="Events">Events</option>
                <option value="Trips">Trips</option>
              </select>
            </div>
            <div className='flex-1 px-4 border-r'>
              <input 
                type="text" 
                placeholder="Event location"
                className='w-full border-none focus:outline-none text-gray-600'
                value={searchParams.location}
                onChange={(e) => setSearchParams({...searchParams, location: e.target.value})}
              />
            </div>
            <div className='flex-1 px-4 border-r'>
              <input 
                type="date" 
                placeholder="Event date"
                className='w-full border-none focus:outline-none text-gray-600'
                value={searchParams.dates}
                onChange={(e) => setSearchParams({...searchParams, dates: e.target.value})}
              />
            </div>
            <div className='flex-1 px-4'>
              <input 
                type="number" 
                placeholder="Number of guests"
                min="1"
                className='w-full border-none focus:outline-none text-gray-600'
                value={searchParams.guests}
                onChange={(e) => setSearchParams({...searchParams, guests: e.target.value})}
              />
            </div>
            <button 
              type="submit"
              className='bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors ml-2'
              onClick={handleSearch}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        );

      case 'Trips':
        return (
          <div className='bg-white rounded-full shadow-lg p-2 flex items-center'>
            <div className='px-4 border-r'>
              <select 
                className='border-none focus:outline-none text-gray-600 bg-transparent'
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <option value="Hotels">Hotels</option>
                <option value="Events">Events</option>
                <option value="Trips">Trips</option>
              </select>
            </div>
            <div className='flex-1 px-4 border-r'>
              <input 
                type="text" 
                placeholder="Trip location"
                className='w-full border-none focus:outline-none text-gray-600'
                value={searchParams.location}
                onChange={(e) => setSearchParams({...searchParams, location: e.target.value})}
              />
            </div>
            <div className='flex-1 px-4 border-r'>
              <input 
                type="date" 
                placeholder="Trip date"
                className='w-full border-none focus:outline-none text-gray-600'
                value={searchParams.dates}
                onChange={(e) => setSearchParams({...searchParams, dates: e.target.value})}
              />
            </div>
            <div className='flex-1 px-4'>
              <input 
                type="number" 
                placeholder="Number of guests"
                min="1"
                className='w-full border-none focus:outline-none text-gray-600'
                value={searchParams.guests}
                onChange={(e) => setSearchParams({...searchParams, guests: e.target.value})}
              />
            </div>
            <button 
              type="submit"
              className='bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors ml-2'
              onClick={handleSearch}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className='flex flex-col md:flex-row flex-wrap justify-center items-center min-h-[400px] bg-[#5f6FFF] rounded-lg px-6 md:px-10 lg:px-20'>
      <div className='flex flex-col gap-4 items-center max-w-2xl'>
        <h1 className='text-white text-4xl font-bold text-center'>Welcome to our Smart Travel Booking</h1>
        <p className='text-white text-lg text-center'>Find the best deals on hotels, flights, trips, and events. Start your adventure today.</p>
        <form onSubmit={handleSearch} className='w-full max-w-4xl'>
          {renderSearchFields()}
        </form>
      </div>
    </div>
  );
}

export default Hero;