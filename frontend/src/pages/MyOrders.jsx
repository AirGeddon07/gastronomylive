import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import UserOrderCard from '../components/UserOrderCard';
import OwnerOrderCard from '../components/OwnerOrderCard';
import { setMyOrders, updateRealtimeOrderStatus } from '../redux/userSlice';

function MyOrders() {
    const { userData, myOrders, socket } = useSelector(state => state.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    useEffect(() => {
        socket?.on('newOrder', (data) => {
            if (data.shopOrders?.owner._id == userData._id) {
                dispatch(setMyOrders([data, ...myOrders]))
            }
        })

        socket?.on('update-status', ({orderId, shopId, status, userId}) => {
            if (userId == userData._id) {
                dispatch(updateRealtimeOrderStatus({orderId, shopId, status}))
            }
        })

        return () => {
            socket?.off('newOrder')
            socket?.off('update-status')
        }
    }, [socket])

    return (
        <div className='min-h-screen bg-[#fff9f6] dark:bg-[#121212] flex justify-center px-4 pt-24 pb-12 transition-colors duration-300'>
            <div className='w-full max-w-[800px]'>

                <div className='flex items-center gap-[15px] mb-8'>
                    <button className='z-[10] bg-white dark:bg-[#1e1e1e] p-2 rounded-full shadow-md border border-gray-100 dark:border-gray-800 hover:scale-105 transition-transform cursor-pointer' onClick={() => navigate("/")}>
                        <IoIosArrowRoundBack size={30} className='text-[#ff4d2d] dark:text-[#f97316]' />
                    </button>
                    <h1 className='text-3xl font-extrabold text-gray-900 dark:text-white'>My Orders</h1>
                </div>

                {myOrders?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="text-6xl mb-4 opacity-50">🧾</div>
                        <p className='text-gray-500 dark:text-gray-400 text-xl font-medium'>No orders found.</p>
                    </div>
                ) : (
                    <div className='space-y-6'>
                        {myOrders?.map((order, index) => (
                            userData.role == "user" ? (
                                <UserOrderCard data={order} key={index} />
                            ) : userData.role == "owner" ? (
                                <OwnerOrderCard data={order} key={index} />
                            ) : null
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyOrders