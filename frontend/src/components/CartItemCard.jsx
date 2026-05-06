import React from 'react'
import { FaMinus, FaPlus } from "react-icons/fa";
import { CiTrash } from "react-icons/ci";
import { useDispatch } from 'react-redux';
import { removeCartItem, updateQuantity } from '../redux/userSlice';

function CartItemCard({data}) {
    const dispatch = useDispatch()
    
    const handleIncrease = (id, currentQty) => {
       dispatch(updateQuantity({id, quantity: currentQty + 1}))
    }
    const handleDecrease = (id, currentQty) => {
        if(currentQty > 1){
            dispatch(updateQuantity({id, quantity: currentQty - 1}))
        }
    }
    
  return (
    <div className='flex items-center justify-between bg-white dark:bg-[#1e1e1e] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-300'>
      <div className='flex items-center gap-5'>
        <div className="w-24 h-24 rounded-xl overflow-hidden shadow-inner border border-gray-100 dark:border-gray-700 flex-shrink-0">
            <img src={data.image} alt={data.name} className='w-full h-full object-cover'/>
        </div>
        <div>
            <h1 className='font-bold text-gray-900 dark:text-white text-lg leading-tight mb-1'>{data.name}</h1>
            <p className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-1'>₹{data.price} <span className="mx-1 text-gray-300 dark:text-gray-600">x</span> {data.quantity}</p>
            <p className="font-black text-[#ff4d2d] dark:text-[#f97316] text-lg">₹{data.price * data.quantity}</p>
        </div>
      </div>
      
      <div className='flex flex-col sm:flex-row items-end sm:items-center gap-4'>
        <div className="flex items-center bg-gray-50 dark:bg-[#2a2a2a] p-1 rounded-full border border-gray-200 dark:border-gray-700 shadow-inner">
            <button className='w-8 h-8 flex items-center justify-center cursor-pointer bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-200 rounded-full hover:shadow-md transition-shadow' onClick={() => handleDecrease(data.id, data.quantity)}>
                <FaMinus size={12}/>
            </button>
            <span className="w-8 text-center font-bold text-gray-800 dark:text-white text-sm">{data.quantity}</span>
            <button className='w-8 h-8 flex items-center justify-center cursor-pointer bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-200 rounded-full hover:shadow-md transition-shadow' onClick={() => handleIncrease(data.id, data.quantity)}>
                <FaPlus size={12}/>
            </button>
        </div>
        <button className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-500 hover:text-white hover:bg-red-500 dark:hover:bg-red-600 rounded-xl transition-colors cursor-pointer" onClick={() => dispatch(removeCartItem(data.id))}>
            <CiTrash size={22} strokeWidth={1}/>
        </button>
      </div>
    </div>
  )
}

export default CartItemCard