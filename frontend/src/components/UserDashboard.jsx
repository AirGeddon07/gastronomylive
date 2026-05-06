import React, { useEffect, useRef, useState } from 'react'
import Nav from './Nav' 
import { categories } from '../category'
import CategoryCard from './CategoryCard'
import { FaCircleChevronLeft } from "react-icons/fa6";
import { FaCircleChevronRight } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import FoodCard from './FoodCard';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';

function UserDashboard() {
  const {currentCity, shopInMyCity, itemsInMyCity, searchItems} = useSelector(state => state.user)
  const cateScrollRef = useRef()
  const shopScrollRef = useRef()
  const navigate = useNavigate()
  const [showLeftCateButton, setShowLeftCateButton] = useState(false)
  const [showRightCateButton, setShowRightCateButton] = useState(false)
  const [showLeftShopButton, setShowLeftShopButton] = useState(false)
  const [showRightShopButton, setShowRightShopButton] = useState(false)
  
  const [updatedItemsList, setUpdatedItemsList] = useState([])
  // ✨ NEW: State to track the active category filter
  const [activeCategory, setActiveCategory] = useState("All") 

  const handleFilterByCategory = (category) => {
    // If they click the same category again, toggle it off (back to "All")
    if(activeCategory === category) {
        setActiveCategory("All")
        setUpdatedItemsList(itemsInMyCity)
    } else {
        setActiveCategory(category)
        const filteredList = itemsInMyCity?.filter(i => i.category === category)
        setUpdatedItemsList(filteredList)
    }
  }

  useEffect(() => {
    setUpdatedItemsList(itemsInMyCity)
  }, [itemsInMyCity])

  const updateButton = (ref, setLeftButton, setRightButton) => {
    const element = ref.current
    if(element){
      setLeftButton(element.scrollLeft > 0)
      setRightButton(element.scrollLeft + element.clientWidth < element.scrollWidth)
    }
  }

  const scrollHandler = (ref, direction) => {
    if(ref.current){
      ref.current.scrollBy({
        left: direction == "left" ? -200 : 200,
        behavior: "smooth"
      })
    }
  }

  useEffect(() => {
    if(cateScrollRef.current){
      updateButton(cateScrollRef, setShowLeftCateButton, setShowRightCateButton)
      updateButton(shopScrollRef, setShowLeftShopButton, setShowRightShopButton)
      cateScrollRef.current.addEventListener('scroll', () => {
        updateButton(cateScrollRef, setShowLeftCateButton, setShowRightCateButton)
      })
      shopScrollRef.current.addEventListener('scroll', () => {
         updateButton(shopScrollRef, setShowLeftShopButton, setShowRightShopButton)
      })
    }
    return () => {
      cateScrollRef?.current?.removeEventListener("scroll", () => {
        updateButton(cateScrollRef, setShowLeftCateButton, setShowRightCateButton)
      })
      shopScrollRef?.current?.removeEventListener("scroll", () => {
        updateButton(shopScrollRef, setShowLeftShopButton, setShowRightShopButton)
      })
    }
  }, [categories])

  return (
    <div className='w-full flex flex-col gap-8 items-center bg-transparent pt-24 pb-12 transition-colors duration-300'>
      <Nav />

      {searchItems && searchItems.length > 0 && (
        <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-6 bg-white dark:bg-[#1e1e1e] shadow-lg rounded-3xl mt-4 border border-gray-100 dark:border-gray-800 transition-colors duration-300'>
          <h1 className='text-gray-900 dark:text-white text-2xl sm:text-3xl font-bold border-b border-gray-200 dark:border-gray-700 w-full pb-3'>
            Search Results
          </h1>
          <div className='w-full h-auto flex flex-wrap gap-6 justify-center'>
            {searchItems.map((item) => (
              <FoodCard data={item} key={item._id}/>
            ))}
          </div>
        </div>
      )}

      <div className="w-full max-w-6xl flex flex-col gap-4 items-start px-4">
        <h1 className='text-gray-800 dark:text-gray-100 text-2xl sm:text-3xl font-bold tracking-tight'>Inspiration for your first order</h1>
        <div className='w-full relative'>
          {showLeftCateButton &&  <button className='absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/60 backdrop-blur-md text-[#ff4d2d] dark:text-[#f97316] p-2 rounded-full shadow-lg hover:scale-110 transition-transform z-10' onClick={() => scrollHandler(cateScrollRef,"left")}><FaCircleChevronLeft size={28} /></button>}
         
          <div className='w-full flex overflow-x-auto gap-4 pb-4 pt-2' ref={cateScrollRef}>
            {categories.map((cate, index) => (
              <CategoryCard 
                name={cate.category} 
                image={cate.image} 
                key={index} 
                onClick={() => handleFilterByCategory(cate.category)}
                isActive={activeCategory === cate.category} // ✨ NEW: Passes true if this category is selected
              />
            ))}
          </div>
          
          {showRightCateButton &&  <button className='absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/60 backdrop-blur-md text-[#ff4d2d] dark:text-[#f97316] p-2 rounded-full shadow-lg hover:scale-110 transition-transform z-10' onClick={() => scrollHandler(cateScrollRef,"right")}><FaCircleChevronRight size={28} /></button>}
        </div>
      </div>

      <div className='w-full max-w-6xl flex flex-col gap-4 items-start px-4'>
        <h1 className='text-gray-800 dark:text-gray-100 text-2xl sm:text-3xl font-bold tracking-tight'>Best Shops in {currentCity}</h1>
        <div className='w-full relative'>
          {showLeftShopButton &&  <button className='absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/60 backdrop-blur-md text-[#ff4d2d] dark:text-[#f97316] p-2 rounded-full shadow-lg hover:scale-110 transition-transform z-10' onClick={() => scrollHandler(shopScrollRef,"left")}><FaCircleChevronLeft size={28} /></button>}
         
          <div className='w-full flex overflow-x-auto gap-4 pb-4 pt-2' ref={shopScrollRef}>
            {shopInMyCity?.map((shop, index) => (
              <CategoryCard name={shop.name} image={shop.image} key={index} onClick={() => navigate(`/shop/${shop._id}`)}/>
            ))}
          </div>
          
          {showRightShopButton &&  <button className='absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/60 backdrop-blur-md text-[#ff4d2d] dark:text-[#f97316] p-2 rounded-full shadow-lg hover:scale-110 transition-transform z-10' onClick={() => scrollHandler(shopScrollRef,"right")}><FaCircleChevronRight size={28} /></button>}
        </div>
      </div>

      <div className='w-full max-w-6xl flex flex-col gap-6 items-center px-4 mt-4'>
        <h1 className='text-gray-800 dark:text-gray-100 text-3xl sm:text-4xl font-extrabold w-full text-center mb-4 flex items-center justify-center gap-3'>
          {activeCategory !== "All" ? `Suggested ${activeCategory}` : "Suggested Food Items"}
        </h1>
        
        {/* ✨ NEW: Shows a message if the filter finds nothing */}
        {updatedItemsList?.length === 0 ? (
            <div className="text-center py-10 bg-white dark:bg-[#1e1e1e] w-full rounded-3xl border border-gray-100 dark:border-gray-800">
                <div className="text-6xl mb-4 opacity-50">🍽️</div>
                <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">No items found in {currentCity} for this category.</p>
                <button onClick={() => handleFilterByCategory("All")} className="mt-4 text-[#ff4d2d] font-bold hover:underline">View All Items</button>
            </div>
        ) : (
            <div className='w-full h-auto flex flex-wrap gap-8 justify-center'>
              {updatedItemsList?.map((item, index) => (
                <FoodCard key={index} data={item}/>
              ))}
            </div>
        )}
      </div>
    </div>
  )
}

export default UserDashboard