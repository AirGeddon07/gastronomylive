import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../App'

function UserOrderCard({ data }) {
    const navigate = useNavigate()
    const [selectedRating, setSelectedRating] = useState({})

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleString('en-GB', { day: "2-digit", month: "short", year: "numeric" })
    }

    const handleRating = async (itemId, rating) => {
        try {
            await axios.post(`${serverUrl}/api/item/rating`, { itemId, rating }, { withCredentials: true })
            setSelectedRating(prev => ({...prev, [itemId]: rating}))
        } catch (error) { console.log(error) }
    }

    return (
        <div className='bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 p-6 space-y-6 transition-colors duration-300'>
            <div className='flex justify-between border-b border-gray-100 dark:border-gray-700 pb-4'>
                <div>
                    <p className='font-bold text-gray-900 dark:text-white text-lg'>Order <span className="text-[#ff4d2d] dark:text-[#f97316]">#{data._id.slice(-6)}</span></p>
                    <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>Placed on {formatDate(data.createdAt)}</p>
                </div>
                <div className='text-right'>
                    <p className='text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1'>
                        {data.paymentMethod == "cod" ? "Cash on Delivery" : `Paid Online: ${data.payment ? "Yes" : "Pending"}`}
                    </p>
                    <span className="inline-block bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-blue-100 dark:border-blue-900/30">
                        {data.shopOrders?.[0].status}
                    </span>
                </div>
            </div>

            {data.shopOrders.map((shopOrder, index) => (
                <div className='border border-gray-200 dark:border-gray-700 rounded-2xl p-4 bg-gray-50 dark:bg-[#2a2a2a] space-y-4' key={index}>
                    <p className="font-bold text-gray-800 dark:text-white text-lg flex items-center gap-2">
                        <span className="text-xl">🏪</span> {shopOrder.shop.name}
                    </p>

                    <div className='flex space-x-4 overflow-x-auto pb-4 custom-scrollbar'>
                        {shopOrder.shopOrderItems.map((item, index) => (
                            <div key={index} className='flex-shrink-0 w-44 border border-gray-200 dark:border-gray-700 rounded-xl p-3 bg-white dark:bg-[#1e1e1e] shadow-sm'>
                                <div className="h-24 w-full rounded-lg overflow-hidden mb-3 shadow-inner">
                                    <img src={item.item.image} alt="" className='w-full h-full object-cover' />
                                </div>
                                <p className='text-sm font-bold text-gray-900 dark:text-white truncate mb-1'>{item.name}</p>
                                <p className='text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#2a2a2a] p-1.5 rounded-md inline-block border border-gray-100 dark:border-gray-700'>
                                    Qty: {item.quantity} <span className="text-gray-300 dark:text-gray-600 mx-1">x</span> ₹{item.price}
                                </p>

                                {shopOrder.status == "delivered" && (
                                    <div className='flex space-x-1 mt-3 justify-center bg-gray-50 dark:bg-[#2a2a2a] p-1.5 rounded-full border border-gray-100 dark:border-gray-700'>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button key={star} className={`text-base transition-transform hover:scale-125 ${selectedRating[item.item._id] >= star ? 'text-yellow-400 drop-shadow-sm' : 'text-gray-300 dark:text-gray-600'}`} onClick={() => handleRating(item.item._id, star)}>★</button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className='flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-3'>
                        <p className='font-bold text-gray-700 dark:text-gray-300'>Subtotal: <span className="text-gray-900 dark:text-white">₹{shopOrder.subtotal}</span></p>
                        <span className='text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide'>{shopOrder.status}</span>
                    </div>
                </div>
            ))}

            <div className='flex flex-col sm:flex-row justify-between items-center border-t border-gray-100 dark:border-gray-800 pt-6 gap-4'>
                <p className='text-xl font-bold text-gray-900 dark:text-white'>Total Paid: <span className="text-[#ff4d2d] dark:text-[#f97316] font-black">₹{data.totalAmount}</span></p>
                <button className='w-full sm:w-auto bg-gradient-to-r from-[#ff4d2d] to-[#e64526] hover:from-[#e64526] hover:to-[#cc3e22] text-white px-8 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all cursor-pointer' onClick={() => navigate(`/track-order/${data._id}`)}>
                    Track Order Location
                </button>
            </div>
        </div>
    )
}

export default UserOrderCard