import React, { useState } from 'react'
import { FaLeaf, FaDrumstickBite, FaStar, FaRegStar, FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/userSlice';

function FoodCard({data}) {
    const [quantity, setQuantity] = useState(0)
    const dispatch = useDispatch()
    const {cartItems} = useSelector(state => state.user)
    
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
           stars.push(
            (i <= rating) ? (
                <FaStar key={i} className='text-yellow-400 text-sm'/>
            ) : (
                <FaRegStar key={i} className='text-gray-300 dark:text-gray-600 text-sm'/>
            )
           )
        }
        return stars
    }

    const handleIncrease = () => {
        const newQty = quantity + 1
        setQuantity(newQty)
    }
    
    const handleDecrease = () => {
        if(quantity > 0){
            const newQty = quantity - 1
            setQuantity(newQty)
        }
    }

  return (
    <div className='w-[280px] rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1e1e1e] shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col overflow-hidden group'>
      <div className='relative w-full h-[190px] overflow-hidden bg-gray-100 dark:bg-[#2a2a2a]'>
        <div className='absolute top-3 right-3 z-10 bg-white/80 dark:bg-black/60 backdrop-blur-md rounded-full p-2 shadow-sm border border-white/50 dark:border-gray-700'>
            {data.foodType == "veg" ? <FaLeaf className='text-green-500 text-lg'/> : <FaDrumstickBite className='text-red-500 text-lg'/>}
        </div>
        <img src={data.image} alt={data.name} className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="flex-1 flex flex-col p-5">
        <h1 className='font-bold text-gray-900 dark:text-white text-lg truncate mb-1'>{data.name}</h1>
        <div className='flex items-center gap-1.5 mt-1'>
            <div className="flex bg-gray-50 dark:bg-[#2a2a2a] px-2 py-1 rounded-md border border-gray-100 dark:border-gray-700">
                {renderStars(data.rating?.average || 0)}
            </div>
            <span className='text-xs font-medium text-gray-500 dark:text-gray-400'>
                ({data.rating?.count || 0} reviews)
            </span>
        </div>
      </div>

      <div className='flex items-center justify-between mt-auto p-5 pt-0 border-t border-gray-100 dark:border-gray-800 mt-2 pt-4'>
        <span className='font-black text-gray-900 dark:text-white text-xl'>
            ₹{data.price}
        </span>

        <div className='flex items-center bg-gray-50 dark:bg-[#2a2a2a] rounded-full border border-gray-200 dark:border-gray-700 p-1 shadow-inner'>
            <button className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors shadow-sm' onClick={handleDecrease}>
                <FaMinus size={12}/>
            </button>
            <span className='w-6 text-center font-bold text-gray-800 dark:text-white text-sm'>{quantity}</span>
            <button className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors shadow-sm' onClick={handleIncrease}>
                <FaPlus size={12}/>
            </button>
            
            {/* ✨ FIX: Defaults to adding 1 item if user clicks cart without pressing '+' */}
            <button className={`ml-2 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer ${cartItems.some(i => i.id == data._id) ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md scale-105" : "bg-gradient-to-r from-[#ff4d2d] to-[#e64526] text-white hover:shadow-lg hover:scale-105"}`} 
                onClick={() => {
                    const qtyToAdd = quantity > 0 ? quantity : 1;
                    dispatch(addToCart({
                        id: data._id, name: data.name, price: data.price, image: data.image, shop: data.shop, quantity: qtyToAdd, foodType: data.foodType
                    }))
                }}>
                <FaShoppingCart size={16}/>
            </button>
        </div>
      </div>
    </div>
  )
}

export default FoodCard