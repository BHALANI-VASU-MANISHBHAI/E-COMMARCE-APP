import React, { useEffect } from 'react'
import { useState } from 'react'
import Login from './components/Login'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Edit from './pages/Edit'
import { ToastContainer, toast } from 'react-toastify';


export const backendUrl = import.meta.env.VITE_BACKEND_URL


const App = () => {
  const [token , settoken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : "")

  useEffect(() => {
    localStorage.setItem('token', token)
  }
  , [token])

    return (
        <div className='bg-gray-50 min-h-screen'>
            <ToastContainer/>
          {token=="" ? <Login   setToken={settoken}   /> :<>
                <Navbar setToken={settoken} />
                <hr />
                <div className='flex w-full'>
                    <Sidebar />
                    <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
                        <Routes>
                            <Route path='/add' element={<Add  token={token}/>} />
                            <Route path='/list' element={<List token={token} />} />
                            <Route path='/orders' element={<Orders token={token} />} />
                            <Route path='/edit/:id' element={<Edit token={token} />} />
                        </Routes>
                    </div>
                </div>
            </>}
            
        </div>
    )
}

export default App