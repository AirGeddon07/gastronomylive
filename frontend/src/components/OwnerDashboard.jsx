import React from 'react'
import Nav from './Nav' 
import { useSelector } from 'react-redux'
import { FaUtensils, FaPen } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import OwnerItemCard from './OwnerItemCard'; 

function OwnerDashboard() {
  const { myShopData } = useSelector(state => state.owner)
  const navigate = useNavigate()

  return (
    /* ✨ FIX: Added pt-24 here so it clears the Navbar */
    <div className='w-full flex flex-col items-center bg-transparent pt-24 pb-12 transition-colors duration-300'>
      <Nav />
      
      {!myShopData &&
        <div className='flex justify-center items-center p-4 sm:p-6 mt-10'>
          <div className='w-full max-w-md bg-white dark:bg-[#1e1e1e] shadow-xl rounded-3xl p-8 border border-gray-100 dark:border-gray-800 transition-colors duration-300'>
            <div className='flex flex-col items-center text-center'>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-full mb-6 ring-4 ring-orange-100 dark:ring-orange-900/10">
                 <FaUtensils className='text-[#ff4d2d] dark:text-[#f97316] w-12 h-12' />
              </div>
              <h2 className='text-2xl font-bold text-gray-800 dark:text-white mb-3'>Add Your Restaurant</h2>
              <p className='text-gray-500 dark:text-gray-400 mb-8'>Join our premium food delivery platform and reach thousands of hungry customers every day.</p>
              <button className='w-full bg-gradient-to-r from-[#ff4d2d] to-[#e64526] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer' onClick={() => navigate("/create-edit-shop")}>
                Get Started
              </button>
            </div>
          </div>
        </div>
      }

      {myShopData &&
        <div className='w-full flex flex-col items-center gap-8 px-4 sm:px-6 mt-6'>
          <h1 className='text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3 text-center'>
            <FaUtensils className='text-[#ff4d2d] dark:text-[#f97316]' /> 
            Welcome to {myShopData.name}
          </h1>

          <div className='bg-white dark:bg-[#1e1e1e] shadow-xl rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 transition-colors duration-300 w-full max-w-3xl relative group'>
            <div className='absolute top-4 right-4 bg-white/80 dark:bg-black/60 backdrop-blur-md text-gray-800 dark:text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer z-10' onClick={() => navigate("/create-edit-shop")}>
              <FaPen size={18}/>
            </div>
            <div className="relative h-56 sm:h-72 w-full">
              <img src={myShopData.image} alt={myShopData.name} className='w-full h-full object-cover'/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            
             <div className='p-6 relative -mt-10 bg-white dark:bg-[#1e1e1e] rounded-t-3xl'>
              <h1 className='text-2xl sm:text-3xl font-black text-gray-800 dark:text-white mb-1'>{myShopData.name}</h1>
              <p className='text-sm font-bold text-[#ff4d2d] dark:text-[#f97316] mb-2 uppercase tracking-wide'>{myShopData.city}, {myShopData.state}</p>
              <p className='text-gray-600 dark:text-gray-400 font-medium'>{myShopData.address}</p>
            </div>
          </div>

          {myShopData.items.length == 0 && 
            <div className='flex justify-center items-center w-full'>
              <div className='w-full max-w-3xl bg-white dark:bg-[#1e1e1e] shadow-lg rounded-3xl p-10 border border-gray-100 dark:border-gray-800 border-dashed border-2 transition-colors duration-300'>
                <div className='flex flex-col items-center text-center'>
                  <div className="text-6xl mb-4 opacity-50">🍔</div>
                  <h2 className='text-2xl font-bold text-gray-800 dark:text-white mb-2'>Build Your Menu</h2>
                  <p className='text-gray-500 dark:text-gray-400 mb-6'>Share your delicious creations with our customers by adding them to the menu.</p>
                  <button className='bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3 rounded-xl font-bold shadow-md hover:scale-105 transition-transform duration-200' onClick={() => navigate("/add-item")}>
                    + Add First Item
                  </button>
                </div>
              </div>
            </div>
          }

          {myShopData.items.length > 0 && 
            <div className='flex flex-col items-center gap-4 w-full max-w-3xl '>
              <div className="w-full flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Active Menu Items</h3>
              </div>
              {myShopData.items.map((item, index) => (
                <OwnerItemCard data={item} key={index}/>
              ))}
            </div>
          }
        </div>
      }
    </div>
  )
}

export default OwnerDashboard