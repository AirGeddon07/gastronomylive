import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { serverUrl } from '../App'
import { IoIosArrowRoundBack } from "react-icons/io";
import DeliveryBoyTracking from '../components/DeliveryBoyTracking'
import { useSelector } from 'react-redux'

function TrackOrderPage() {
    const { orderId } = useParams()
    const [currentOrder, setCurrentOrder] = useState() 
    const navigate = useNavigate()
    const { socket } = useSelector(state => state.user)
    const [liveLocations, setLiveLocations] = useState({})
    
    const handleGetOrder = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/order/get-order-by-id/${orderId}`, { withCredentials: true })
            setCurrentOrder(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        socket.on('updateDeliveryLocation', ({deliveryBoyId, latitude, longitude}) => {
            setLiveLocations(prev => ({
                ...prev,
                [deliveryBoyId]: {lat: latitude, lon: longitude}
            }))
        })
    }, [socket])

    useEffect(() => {
        handleGetOrder()
    }, [orderId])

    return (
        <div className='min-h-screen bg-[#fff9f6] dark:bg-[#121212] pt-24 pb-12 transition-colors duration-300'>
            <div className='max-w-4xl mx-auto px-4 flex flex-col gap-6'>
                <div className='flex items-center gap-[15px] mb-4'>
                    <button className='z-[10] bg-white dark:bg-[#1e1e1e] p-2 rounded-full shadow-md border border-gray-100 dark:border-gray-800 hover:scale-105 transition-transform cursor-pointer' onClick={() => navigate("/")}>
                        <IoIosArrowRoundBack size={30} className='text-[#ff4d2d] dark:text-[#f97316]' />
                    </button>
                    <h1 className='text-3xl font-extrabold text-gray-900 dark:text-white'>Track Order</h1>
                </div>

                {currentOrder?.shopOrders?.map((shopOrder, index) => (
                    <div className='bg-white dark:bg-[#1e1e1e] p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 space-y-5 transition-colors duration-300' key={index}>
                        <div className="border-b border-gray-100 dark:border-gray-800 pb-5">
                            <p className='text-2xl font-black mb-3 text-[#ff4d2d] dark:text-[#f97316]'>{shopOrder.shop.name}</p>
                            <div className="space-y-2 text-gray-700 dark:text-gray-300">
                                <p><span className='font-bold text-gray-900 dark:text-white'>Items:</span> {shopOrder.shopOrderItems?.map(i => i.name).join(", ")}</p>
                                <p><span className='font-bold text-gray-900 dark:text-white'>Subtotal:</span> ₹{shopOrder.subtotal}</p>
                                <p className='mt-4 bg-gray-50 dark:bg-[#2a2a2a] p-3 rounded-xl border border-gray-100 dark:border-gray-700'><span className='font-bold text-gray-900 dark:text-white'>Delivery Address:</span> {currentOrder.deliveryAddress?.text}</p>
                            </div>
                        </div>

                        {shopOrder.status != "delivered" ? (
                            <>
                                {shopOrder.assignedDeliveryBoy ? (
                                    <div className='bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-4 rounded-xl text-sm text-gray-800 dark:text-gray-200'>
                                        <p className='font-bold mb-1'>Delivery Partner Assigned!</p>
                                        <p><span className='font-semibold text-gray-500 dark:text-gray-400'>Name:</span> {shopOrder.assignedDeliveryBoy.fullName}</p>
                                        <p><span className='font-semibold text-gray-500 dark:text-gray-400'>Contact:</span> {shopOrder.assignedDeliveryBoy.mobile}</p>
                                    </div>
                                ) : (
                                    <p className='font-semibold text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/10 p-4 rounded-xl text-center border border-orange-100 dark:border-orange-900/30'>Searching for a delivery partner...</p>
                                )}
                            </>
                        ) : (
                            <div className='bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 p-4 rounded-xl text-center'>
                                <p className='text-green-600 dark:text-green-400 font-extrabold text-xl'>Delivered Successfully 🎉</p>
                            </div>
                        )}

                        {(shopOrder.assignedDeliveryBoy && shopOrder.status !== "delivered") && (
                            <div className="h-[450px] w-full rounded-2xl overflow-hidden shadow-inner border border-gray-200 dark:border-gray-700 relative z-0">
                                <DeliveryBoyTracking data={{
                                    deliveryBoyLocation: liveLocations[shopOrder.assignedDeliveryBoy._id] || {
                                        lat: shopOrder.assignedDeliveryBoy.location.coordinates[1],
                                        lon: shopOrder.assignedDeliveryBoy.location.coordinates[0]
                                    },
                                    customerLocation: {
                                        lat: currentOrder.deliveryAddress.latitude,
                                        lon: currentOrder.deliveryAddress.longitude
                                    }
                                }} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TrackOrderPage