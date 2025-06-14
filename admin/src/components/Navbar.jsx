import React from 'react'
import assets from '../assets/assets.js'

const Navbar = () => {
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  }

  return (
    <div className='flex items-center py-2 px-[4%]  justify-between '>
        <img className='w-25 md:w-35 ' src={assets.logo} alt="" /> 
         <button className='bg-gray-700 text-white px-5 py-2 sm;px-7 sm:py-2 rounded-full text-xs sm:text-sm' onClick={(e)=>handleLogout()}  >Logout</button>
    </div>
  )
}

export default Navbar 