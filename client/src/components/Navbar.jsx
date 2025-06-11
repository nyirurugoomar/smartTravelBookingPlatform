import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { assets } from '../assets/asset'
import { useAuth } from '../context/AuthContext'

function Navbar() {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
      <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-gray-40 '>
          <h3 className='text-3xl font-bold'>Logo</h3>
          <ul className='hidden md:flex items-start gap-5 font-medium cursor-pointer'>
              <NavLink to='/'>
                <li className='py-1'>HOME</li>
                <hr className='border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden'/>
              </NavLink>
              <NavLink to='/events'>
                <li className='py-1'>EVENTS</li>
                <hr className='border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden'/>
              </NavLink>
              <NavLink to='/hotels'>
                <li className='py-1'>HOTELS</li>
                <hr className='border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden'/>
              </NavLink>
              <NavLink to='/trips'>
                <li className='py-1'>TRIPS</li>
                <hr className='border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden'/>
              </NavLink>
              <NavLink to='/flights'>
                <li className='py-1'>FLIGHTS</li>
                <hr className='border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden'/>
              </NavLink>
          </ul>
          <div className='flex items-center gap-5'>
            {
              isAuthenticated
              ? <div className='flex items-center gap-2 cursor-pointer group relative'>
                <img className='w-8 rounded-full' src={assets.userIcon} alt='profile'/>
                <img className='w-2.5' src={assets.dropdown_icon} alt='profile'/>
                <div className='absolute top-0 right-0 pt-20 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                   <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-2 p-4'>
                    <p className=' text-black cursor-pointer flex items-center gap-2 '>
                      <img src={assets.userIcon} alt="" className='w-8 rounded-full' />
                      {user?.firstName} {user?.lastName}
                      </p>
                    <p onClick={()=>navigate('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                    <p onClick={handleLogout} className='hover:text-black cursor-pointer'>Logout</p>
                   </div>
                </div>
              </div>
              : <button onClick={() =>navigate('/login')} className='bg-[#5f6FFF] text-white py-3 px-8 rounded-full font-light hidden md:block cursor-pointer'>Sign in</button>
            }
          </div>
      </div>
    )
}

export default Navbar