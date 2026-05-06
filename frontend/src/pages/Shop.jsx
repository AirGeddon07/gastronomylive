import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { serverUrl } from '../App'
import { useNavigate, useParams } from 'react-router-dom'
import { FaStore, FaLocationDot, FaArrowLeft } from "react-icons/fa6";
import { FaUtensils } from "react-icons/fa";
import FoodCard from '../components/FoodCard';

function Shop() {
    const {shopId} = useParams()
    const [items, setItems] = useState([])
    const [shop, setShop] = useState(null)
    const navigate = useNavigate()

    const handleShop = async () => {
        try {
           const result = await axios.get(`${serverUrl}/api/item/get-by-shop/${shopId}`, {withCredentials:true}) 
           setShop(result.data.shop)
           setItems(result.data.items)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleShop()
    }, [shopId])

  return (
    // ✨ NEW: Added global dark mode background and transition
    <div className='min-h-screen bg-gray-50 dark:bg-[#121212] transition-colors duration-300 pb-12'>
        
        {/* ✨ NEW: Floating Glassmorphism Back Button */}
        <button 
            className='fixed top-[100px] left-4 md:left-8 z-20 flex items-center gap-2 bg-white/70 dark:bg-black/50 backdrop-blur-md hover:bg-white dark:hover:bg-black/80 text-gray-800 dark:text-white px-4 py-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-105' 
            onClick={() => navigate("/")}
        >
            <FaArrowLeft />
            <span className="font-semibold">Back</span>
        </button>

      {shop && (
          <div className='relative w-full h-72 md:h-96 lg:h-[450px]'>
              <img src={shop.image} alt={shop.name} className='w-full h-full object-cover'/>
              
              {/* ✨ NEW: Advanced gradient overlay that fades into the dark mode background naturally */}
              <div className='absolute inset-0 bg-gradient-to-t from-gray-50 via-black/50 to-transparent dark:from-[#121212] dark:via-black/70 flex flex-col justify-end items-center text-center pb-12 px-4 transition-colors duration-300'>
                  
                  <div className="bg-white/20 dark:bg-black/40 backdrop-blur-md p-4 rounded-full mb-4 border border-white/30 shadow-2xl">
                      <FaStore className='text-white text-3xl md:text-5xl drop-shadow-md'/>
                  </div>
                  
                  <h1 className='text-4xl md:text-6xl font-extrabold text-white drop-shadow-2xl mb-4 tracking-tight'>{shop.name}</h1>
                  
                  <div className='flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10'>
                      <FaLocationDot size={18} className="text-[#ff4d2d] dark:text-[#f97316]"/>
                      <p className='text-sm md:text-lg font-medium text-gray-100'>{shop.address}</p>
                  </div>
              </div>
          </div>
      )}

        <div className='max-w-7xl mx-auto px-6 pt-12'>
            <div className="flex flex-col items-center mb-12">
                <h2 className='flex items-center justify-center gap-3 text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-gray-100 transition-colors duration-300'>
                    <FaUtensils className="text-[#ff4d2d] dark:text-[#f97316]"/> 
                    Our Menu
                </h2>
                {/* ✨ NEW: Aesthetic underline accent */}
                <div className="h-1 w-24 bg-[#ff4d2d] dark:bg-[#f97316] mt-4 rounded-full"></div>
            </div>

            {items.length > 0 ? (
                <div className='flex flex-wrap justify-center gap-8'>
                    {items.map((item, index) => (
                        <FoodCard data={item} key={index} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-10">
                    <div className="text-6xl mb-4 opacity-50">🍽️</div>
                    <p className='text-center text-gray-500 dark:text-gray-400 text-lg font-medium'>No Items Available Yet</p>
                </div>
            )}
        </div>
    </div>
  )
}

export default Shop