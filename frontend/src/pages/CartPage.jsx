import React from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CartItemCard from '../components/CartItemCard';

function CartPage() {
    const navigate = useNavigate()
    const { cartItems, totalAmount } = useSelector(state => state.user)
    
    return (
        <div className='min-h-screen bg-[#fff9f6] dark:bg-[#121212] pt-24 pb-12 flex justify-center p-6 transition-colors duration-300'>
            <div className='w-full max-w-[800px]'>
                <div className='flex items-center gap-[15px] mb-8'>
                    <button className='z-[10] bg-white dark:bg-[#1e1e1e] p-2 rounded-full shadow-md border border-gray-100 dark:border-gray-800 hover:scale-105 transition-transform cursor-pointer' onClick={() => navigate("/")}>
                        <IoIosArrowRoundBack size={30} className='text-[#ff4d2d] dark:text-[#f97316]' />
                    </button>
                    <h1 className='text-3xl font-extrabold text-gray-900 dark:text-white'>Your Cart</h1>
                </div>
                
                {cartItems?.length == 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="text-6xl mb-4 opacity-50">🛒</div>
                        <p className='text-gray-500 dark:text-gray-400 text-xl font-medium'>Your Cart is Empty</p>
                        <button onClick={() => navigate("/")} className="mt-6 text-[#ff4d2d] dark:text-[#f97316] font-bold hover:underline">Browse Menu</button>
                    </div>
                ) : (
                <>
                    <div className='space-y-4'>
                        {cartItems?.map((item, index) => (
                            <CartItemCard data={item} key={index} />
                        ))}
                    </div>
                    
                    <div className='mt-8 bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 flex justify-between items-center transition-colors duration-300'>
                        <h1 className='text-xl font-bold text-gray-800 dark:text-gray-200'>Total Amount</h1>
                        <span className='text-2xl font-black text-[#ff4d2d] dark:text-[#f97316]'>₹{totalAmount}</span>
                    </div>
                    
                    <div className='mt-6 flex justify-end'> 
                        <button className='w-full md:w-auto bg-[#ff4d2d] dark:bg-[#ea580c] text-white px-10 py-4 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl hover:bg-[#e64526] dark:hover:bg-[#f97316] hover:-translate-y-1 transition-all cursor-pointer' onClick={() => navigate("/checkout")}>
                            Proceed to CheckOut
                        </button>
                    </div>
                </>
                )}
            </div>
        </div>
    )
}

export default CartPage