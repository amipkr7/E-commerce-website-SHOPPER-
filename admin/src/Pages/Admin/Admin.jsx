import React from 'react'
import './Admin.css'
import ListProduct from '../../Components/Navbar/ListProduct/ListProduct'
import AddProduct from '../../Components/Navbar/AddProduct/AddProduct'
import {Routes,Route} from 'react-router-dom'
import Sidebar from '../../Components/Navbar/Sidebar/Sidebar'
const Admin = () => {
  return (
    <div className='admin'>
      <Sidebar/>
      <Routes>
        <Route path='/addproduct' element={<AddProduct/>}/> 
         {/* kahi se bhi addproduct p click hoga toh wo admin m hi khulega*/}
        <Route path='/listproduct' element={<ListProduct/>}/>
      </Routes>
    </div>
  )
}

export default Admin
