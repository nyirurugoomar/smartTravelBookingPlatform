import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Events from './pages/Events'
import Hotels from './pages/Hotels'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Trips from './pages/Trips'
import Footer from './components/Footer'
import Flight from './pages/Flight'
import HotelDetail from './pages/HotelDetail'
import EventDetail from './pages/EventDetail'
import TripDetail from './pages/TripDetail'
import PaymentSuccess from './pages/PaymentSuccess'

function App() {
  return (
    <BrowserRouter>
     <div className='mx-10 sm:mx[10%]'>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/events' element={<Events/>} />
        <Route path='/events/:id' element={<EventDetail/>} />
        <Route path='/hotels' element={<Hotels/>} />
        <Route path='/hotels/:id' element={<HotelDetail/>} />
        <Route path='/trips' element={<Trips/>} />
        <Route path='/trips/:id' element={<TripDetail/>} />
        <Route path='/flights' element={<Flight/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/payment-success' element={<PaymentSuccess/>} />
      </Routes>
       <Footer/>
       <div className='text-center'>
        <h1 className='text-gray-400 font-bold'>Copyright © 2025 Company Name - All Right Reserved.</h1>
      </div>
    </div>
    </BrowserRouter>
   
  )
}

export default App