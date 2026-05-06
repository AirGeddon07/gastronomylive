import React, { useEffect, useState } from 'react'
import Nav from './Nav'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'
import DeliveryBoyTracking from './DeliveryBoyTracking'
import { ClipLoader } from 'react-spinners'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

function DeliveryBoy() {
  const {userData, socket} = useSelector(state => state.user)
  const [currentOrder, setCurrentOrder] = useState()
  const [showOtpBox, setShowOtpBox] = useState(false)
  const [availableAssignments, setAvailableAssignments] = useState(null)
  const [otp, setOtp] = useState("")
  const [todayDeliveries, setTodayDeliveries] = useState([])
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  
  useEffect(() => {
    if(!socket || userData.role !== "deliveryBoy") return
    let watchId
    if(navigator.geolocation){
      watchId = navigator.geolocation.watchPosition((position) => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        setDeliveryBoyLocation({lat: latitude, lon: longitude})
        socket.emit('updateLocation', {
          latitude, longitude, userId: userData._id
        })
      },
      (error) => { console.log(error) },
      { enableHighAccuracy: true })
    }
    return () => {
      if(watchId) navigator.geolocation.clearWatch(watchId)
    }
  }, [socket, userData])

  const ratePerDelivery = 50
  const totalEarning = todayDeliveries.reduce((sum, d) => sum + d.count * ratePerDelivery, 0)

  const getAssignments = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-assignments`, {withCredentials:true})
      setAvailableAssignments(result.data)
    } catch (error) { console.log(error) }
  }

  const getCurrentOrder = async () => {
     try {
      const result = await axios.get(`${serverUrl}/api/order/get-current-order`, {withCredentials:true})
      setCurrentOrder(result.data)
    } catch (error) { console.log(error) }
  }

  const acceptOrder = async (assignmentId) => {
    try {
      await axios.get(`${serverUrl}/api/order/accept-order/${assignmentId}`, {withCredentials:true})
      await getCurrentOrder()
    } catch (error) { console.log(error) }
  }

  useEffect(() => {
    socket.on('newAssignment', (data) => {
      setAvailableAssignments(prev => ([...prev, data]))
    })
    return () => { socket.off('newAssignment') }
  }, [socket])
  
  const sendOtp = async () => {
    setLoading(true)
    try {
      await axios.post(`${serverUrl}/api/order/send-delivery-otp`, {
        orderId: currentOrder._id, shopOrderId: currentOrder.shopOrder._id
      }, {withCredentials:true})
      setLoading(false)
      setShowOtpBox(true)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const verifyOtp = async () => {
    setMessage("")
    try {
      const result = await axios.post(`${serverUrl}/api/order/verify-delivery-otp`, {
        orderId: currentOrder._id, shopOrderId: currentOrder.shopOrder._id, otp
      }, {withCredentials:true})
      setMessage(result.data.message)
      location.reload()
    } catch (error) { console.log(error) }
  }

  const handleTodayDeliveries = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-today-deliveries`, {withCredentials:true})
      setTodayDeliveries(result.data)
    } catch (error) { console.log(error) }
  }
 
  useEffect(() => {
    getAssignments()
    getCurrentOrder()
    handleTodayDeliveries()
  }, [userData])

  return (
    /* ✨ FIX: Added pt-24 here so it clears the Navbar */
    <div className='w-full flex flex-col items-center bg-transparent pt-24 pb-12 transition-colors duration-300'>
      <Nav/>
      <div className='w-full max-w-[800px] flex flex-col gap-6 items-center px-4 mt-6'>
        
        {/* Profile Card */}
        <div className='bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-lg p-6 flex flex-col justify-start items-center w-full border border-gray-100 dark:border-gray-800 text-center gap-2 transition-colors duration-300'>
            <div className="w-16 h-16 bg-gradient-to-tr from-orange-400 to-[#ff4d2d] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md mb-2">
                {userData.fullName.charAt(0)}
            </div>
            <h1 className='text-2xl font-black text-gray-900 dark:text-white'>Welcome, {userData.fullName}</h1>
            <div className='bg-gray-50 dark:bg-[#2a2a2a] px-4 py-2 rounded-xl text-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'>
              <span className='font-bold'>Lat:</span> {deliveryBoyLocation?.lat?.toFixed(4) || "..."} <span className="mx-2">|</span> <span className='font-bold'>Lng:</span> {deliveryBoyLocation?.lon?.toFixed(4) || "..."}
            </div>
        </div>

        {/* Earnings Card */}
        <div className='bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-lg p-6 w-full border border-gray-100 dark:border-gray-800 transition-colors duration-300'>
          <h1 className='text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2'>
              📊 Today's Deliveries
          </h1>
          <div className="bg-gray-50 dark:bg-[#2a2a2a] p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
              <ResponsiveContainer width="100%" height={220}>
              <BarChart data={todayDeliveries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#555" vertical={false} />
                  <XAxis dataKey="hour" tickFormatter={(h) => `${h}:00`} stroke="#888" tick={{fill: '#888'}} />
                  <YAxis allowDecimals={false} stroke="#888" tick={{fill: '#888'}} />
                  <Tooltip cursor={{fill: 'rgba(255, 77, 45, 0.1)'}} contentStyle={{borderRadius: '12px', border: 'none', backgroundColor: '#1e1e1e', color: 'white'}} formatter={(value) => [value, "orders"]} labelFormatter={label => `${label}:00`}/>
                  <Bar dataKey="count" fill='#ff4d2d' radius={[4, 4, 0, 0]} />
              </BarChart>
              </ResponsiveContainer>
          </div>

          <div className='mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/10 border border-green-200 dark:border-green-900/30 rounded-2xl text-center'>
            <h1 className='text-sm font-bold text-green-800 dark:text-green-400 uppercase tracking-wider mb-1'>Today's Earnings</h1>
            <span className='text-4xl font-black text-green-600 dark:text-green-500'>₹{totalEarning}</span>
          </div>
        </div>

        {/* Available Assignments */}
        {!currentOrder && (
          <div className='bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-lg p-6 w-full border border-gray-100 dark:border-gray-800 transition-colors duration-300'>
            <h1 className='text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-white'>🛵 Available Orders</h1>
            <div className='space-y-4'>
            {availableAssignments?.length > 0 ? (
                availableAssignments.map((a, index) => (
                <div className='border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2a2a2a] rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors' key={index}>
                    <div>
                        <p className='text-lg font-black text-[#ff4d2d] dark:text-[#f97316] mb-1'>{a?.shopName}</p>
                        <p className='text-sm text-gray-700 dark:text-gray-300 mb-2'><span className='font-bold'>To:</span> {a?.deliveryAddress.text}</p>
                        <span className='inline-block bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 text-xs px-2 py-1 rounded-md font-medium text-gray-600 dark:text-gray-400'>
                            {a.items.length} items • ₹{a.subtotal}
                        </span>
                    </div>
                    <button className='w-full md:w-auto bg-[#ff4d2d] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#e64528] shadow-md hover:shadow-lg transition-all cursor-pointer' onClick={() => acceptOrder(a.assignmentId)}>
                        Accept Order
                    </button>
                </div>
                ))
            ) : (
                <div className="text-center py-8">
                    <p className='text-gray-500 dark:text-gray-400 font-medium'>Waiting for new assignments...</p>
                </div>
            )}
            </div>
          </div>
        )}

        {/* Current Order Tracking */}
        {currentOrder && (
          <div className='bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-lg p-6 w-full border border-[#ff4d2d]/30 dark:border-[#f97316]/50 ring-2 ring-[#ff4d2d]/10 transition-colors duration-300'>
            <div className="flex justify-between items-center mb-4">
                <h2 className='text-xl font-black text-gray-800 dark:text-white'>📦 Active Delivery</h2>
                <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-bold px-3 py-1 rounded-full uppercase">In Progress</span>
            </div>
            
            <div className='bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-2xl p-5 mb-6'>
                <p className='font-black text-lg text-gray-900 dark:text-white mb-1'>{currentOrder?.shopOrder.shop.name}</p>
                <p className='text-sm font-medium text-gray-600 dark:text-gray-300 mb-3'>{currentOrder.deliveryAddress.text}</p>
                <span className='inline-block bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 text-xs px-2 py-1 rounded-md font-medium text-gray-500 dark:text-gray-400'>
                    {currentOrder.shopOrder.shopOrderItems.length} items • ₹{currentOrder.shopOrder.subtotal}
                </span>
            </div>

            <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-inner h-[300px]">
                <DeliveryBoyTracking data={{ 
                    deliveryBoyLocation: deliveryBoyLocation || {
                        lat: userData.location.coordinates[1],
                        lon: userData.location.coordinates[0]
                    },
                    customerLocation: {
                        lat: currentOrder.deliveryAddress.latitude,
                        lon: currentOrder.deliveryAddress.longitude
                    }
                }} />
            </div>
            
            {!showOtpBox ? (
                <button className='mt-6 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200' onClick={sendOtp} disabled={loading}>
                    {loading ? <ClipLoader size={20} color='white'/> : "Arrived at Destination"}
                </button>
            ) : (
                <div className='mt-6 p-6 border border-orange-200 dark:border-orange-900/50 rounded-2xl bg-orange-50 dark:bg-orange-900/10'>
                    <p className='text-sm font-bold text-gray-800 dark:text-gray-200 mb-3'>Enter OTP provided by <span className='text-[#ff4d2d] dark:text-[#f97316]'>{currentOrder.user.fullName}</span></p>
                    <input type="text" className='w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-white px-4 py-3 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-[#ff4d2d] font-mono tracking-widest text-center text-lg' placeholder='• • • • • •' onChange={(e) => setOtp(e.target.value)} value={otp}/>
                    {message && <p className='text-center text-green-600 dark:text-green-400 font-bold mb-4'>{message}</p>}
                    <button className="w-full bg-[#ff4d2d] dark:bg-[#ea580c] text-white py-3 rounded-xl font-bold hover:bg-[#e64528] dark:hover:bg-[#f97316] shadow-md transition-all" onClick={verifyOtp}>
                        Verify & Complete Delivery
                    </button>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default DeliveryBoy