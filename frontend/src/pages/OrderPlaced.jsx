import React from 'react'
import { FaCircleCheck } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

function OrderPlaced() {
    const navigate = useNavigate()
  return (
    <div className='min-h-screen bg-[#fff9f6] dark:bg-[#121212] flex flex-col justify-center items-center px-4 text-center relative overflow-hidden transition-colors duration-300'>
        <div className="bg-white dark:bg-[#1e1e1e] p-10 md:p-16 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col items-center animate-fade-in-up">
            <FaCircleCheck className='text-green-500 dark:text-green-400 text-7xl md:text-8xl mb-6 animate-bounce'/>
            <h1 className='text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white mb-4 tracking-tight'>Order Placed!</h1>
            <p className='text-gray-600 dark:text-gray-400 max-w-md mb-8 text-lg md:text-xl leading-relaxed'>
                Thank you for your purchase. Your premium meal is being prepared.  
                You can track your order status in the "My Orders" section.
            </p>
            <button className='bg-[#ff4d2d] hover:bg-[#e64526] dark:bg-[#ea580c] dark:hover:bg-[#f97316] text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer' onClick={() => navigate("/my-orders")}>
                Track My Order
            </button>
        </div>
    </div>
  )
}

export default OrderPlaced