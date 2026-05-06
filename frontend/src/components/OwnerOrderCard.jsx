import axios from 'axios';
import React, { useState } from 'react'
import { MdPhone } from "react-icons/md";
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { updateOrderStatus } from '../redux/userSlice';

function OwnerOrderCard({ data }) {
    const [availableBoys, setAvailableBoys] = useState([])
    const dispatch = useDispatch()

    const handleUpdateStatus = async (orderId, shopId, status) => {
        try {
            const result = await axios.post(`${serverUrl}/api/order/update-status/${orderId}/${shopId}`, {status}, {withCredentials:true})
            dispatch(updateOrderStatus({orderId, shopId, status}))
            setAvailableBoys(result.data.availableBoys)
        } catch (error) { console.log(error) }
    }

    return (
        <div className='bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-lg p-6 space-y-5 border border-gray-100 dark:border-gray-800 transition-colors duration-300'>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 dark:border-gray-800 pb-4 gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-[#ff4d2d] dark:text-[#f97316] rounded-full flex items-center justify-center font-black text-xl border border-orange-200 dark:border-orange-800/50">
                        {data.user.fullName.charAt(0)}
                    </div>
                    <div>
                        <h2 className='text-lg font-black text-gray-900 dark:text-white'>{data.user.fullName}</h2>
                        <p className='flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 mt-1 bg-gray-50 dark:bg-[#2a2a2a] px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700 w-max'>
                            <MdPhone className="text-[#ff4d2d] dark:text-[#f97316]" /> {data.user.mobile}
                        </p>
                    </div>
                </div>
                <div className="text-left md:text-right">
                    <span className="inline-block bg-gray-100 dark:bg-[#2a2a2a] text-gray-700 dark:text-gray-300 text-xs font-bold px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 uppercase tracking-wider mb-1">
                        {data.paymentMethod === "online" ? `Online (Paid: ${data.payment})` : `COD`}
                    </span>
                    <p className='text-xs text-gray-500 dark:text-gray-400 font-medium break-all max-w-[200px]'>ID: #{data._id}</p>
                </div>
            </div>

            <div className='bg-gray-50 dark:bg-[#2a2a2a] p-4 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-start gap-3 text-sm'>
                <div className="mt-1 text-[#ff4d2d] dark:text-[#f97316] text-xl">📍</div>
                <div>
                    <p className="font-bold text-gray-800 dark:text-white mb-1">Delivery Address</p>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-1">{data?.deliveryAddress?.text}</p>
                    <p className='text-xs font-mono text-gray-400 dark:text-gray-500 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 px-2 py-1 rounded w-max mt-2'>Lat: {data?.deliveryAddress.latitude.toFixed(4)}, Lon: {data?.deliveryAddress.longitude.toFixed(4)}</p>
                </div>
            </div>

            <div className='flex space-x-4 overflow-x-auto pb-2 custom-scrollbar'>
                {data.shopOrders.shopOrderItems.map((item, index) => (
                    <div key={index} className='flex-shrink-0 w-44 border border-gray-200 dark:border-gray-700 rounded-xl p-3 bg-white dark:bg-[#1e1e1e] shadow-sm'>
                        <img src={item.item.image} alt="" className='w-full h-24 object-cover rounded-lg mb-2 shadow-inner border border-gray-100 dark:border-gray-800' />
                        <p className='text-sm font-bold text-gray-900 dark:text-white truncate'>{item.name}</p>
                        <p className='text-xs font-medium text-gray-500 dark:text-gray-400 mt-1 bg-gray-50 dark:bg-[#2a2a2a] px-2 py-1 rounded border border-gray-100 dark:border-gray-700 inline-block'>Qty: {item.quantity} x ₹{item.price}</p>
                    </div>
                ))}
            </div>

            {data.shopOrders.status == "out of delivery" && (
                <div className="mt-4 p-4 border border-blue-200 dark:border-blue-900/50 rounded-2xl bg-blue-50 dark:bg-blue-900/10 text-sm">
                    <p className="font-bold text-blue-800 dark:text-blue-400 mb-2 flex items-center gap-2">🛵 {data.shopOrders.assignedDeliveryBoy ? "Assigned Partner" : "Looking for Partner"}</p>
                    
                    {availableBoys?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {availableBoys.map((b, index) => (
                                <span key={index} className='bg-white dark:bg-[#1e1e1e] border border-blue-100 dark:border-blue-800 px-3 py-1.5 rounded-full text-blue-700 dark:text-blue-300 font-medium shadow-sm flex items-center gap-2'>
                                    {b.fullName} <span className="opacity-50">•</span> {b.mobile}
                                </span>
                            ))}
                        </div>
                    ) : data.shopOrders.assignedDeliveryBoy ? (
                        <div className="bg-white dark:bg-[#1e1e1e] border border-blue-200 dark:border-blue-800 px-4 py-2 rounded-xl text-blue-800 dark:text-blue-300 font-bold shadow-sm inline-flex items-center gap-3">
                            {data.shopOrders.assignedDeliveryBoy.fullName} <span className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-md text-xs">{data.shopOrders.assignedDeliveryBoy.mobile}</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                            <span className="animate-spin text-lg">⏳</span> Waiting for delivery boy to accept...
                        </div>
                    )}
                </div>
            )}

            <div className='flex flex-col sm:flex-row justify-between items-center mt-4 pt-5 border-t border-gray-100 dark:border-gray-800 gap-4'>
                <div className='flex items-center gap-3 w-full sm:w-auto bg-gray-50 dark:bg-[#2a2a2a] p-2 rounded-xl border border-gray-200 dark:border-gray-700'>
                    <span className='text-sm font-bold text-gray-700 dark:text-gray-300 px-2'>Status</span>
                    <select className='rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#ff4d2d] bg-white dark:bg-[#1e1e1e] text-[#ff4d2d] dark:text-[#f97316] uppercase tracking-wide cursor-pointer w-full sm:w-auto' onChange={(e) => handleUpdateStatus(data._id, data.shopOrders.shop._id, e.target.value)} value={data.shopOrders.status}>
                        <option value="pending">🟡 Pending</option>
                        <option value="preparing">🍳 Preparing</option>
                        <option value="out of delivery">🛵 Out Of Delivery</option>
                        <option value="delivered">✅ Delivered</option>
                    </select>
                </div>

                <div className='text-right'>
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Earnings</p>
                    <p className="text-2xl font-black text-green-600 dark:text-green-500">₹{data.shopOrders.subtotal}</p>
                </div>
            </div>
        </div>
    )
}

export default OwnerOrderCard