import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import TopNavbar from './components/TopNavbar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'

function App() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if(location.pathname === '/') {
      navigate('/movies')
    }
  },[location.pathname])

  
  return (
    <div className='container'>
      <div className='container'>
        <TopNavbar />
      </div>
      <ToastContainer />

      {/* Based on search results */}
      <Outlet /> 
    </div>
  )
}

export default App
