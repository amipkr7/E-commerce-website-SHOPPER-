import React from 'react'
import './Navbar.css'
import navlogo from "../../Assets/nav-logo.svg"
import navProfile from "../../Assets/nav-profile.svg"
const Navbar = () => {
  return (
    <div className='navbar'>
      <img src={navlogo} alt="" />
      <img src={navProfile} alt="" />
    </div>
  )
}

export default Navbar
