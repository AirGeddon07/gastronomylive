import React, { useEffect, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoSearchOutline, IoLocationSharp } from "react-icons/io5";
import { TbCurrentLocation } from "react-icons/tb";
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import "leaflet/dist/leaflet.css"
import { setAddress, setLocation } from '../redux/mapSlice';
import { MdDeliveryDining } from "react-icons/md";
import { FaCreditCard } from "react-icons/fa";
import axios from 'axios';
import { FaMobileScreenButton } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { addMyOrder } from '../redux/userSlice';

function RecenterMap({ location }) {
  if (location.lat && location.lon) {
    const map = useMap()
    map.setView([location.lat, location.lon], 16, { animate: true })
  }
  return null
}

function CheckOut() {
  const { location, address } = useSelector(state => state.map)
  const { cartItems, totalAmount, userData } = useSelector(state => state.user)
  const [addressInput, setAddressInput] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const apiKey = import.meta.env.VITE_GEOAPIKEY
  const deliveryFee = totalAmount > 500 ? 0 : 40
  const AmountWithDeliveryFee = totalAmount + deliveryFee

  const onDragEnd = (e) => {
    const { lat, lng } = e.target._latlng
    dispatch(setLocation({ lat, lon: lng }))
    getAddressByLatLng(lat, lng)
  }

  const getCurrentLocation = () => {
      const latitude = userData.location.coordinates[1]
      const longitude = userData.location.coordinates[0]
      dispatch(setLocation({ lat: latitude, lon: longitude }))
      getAddressByLatLng(latitude, longitude)
  }

  const getAddressByLatLng = async (lat, lng) => {
    try {
      const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apiKey}`)
      dispatch(setAddress(result?.data?.results[0].address_line2))
    } catch (error) {
      console.log(error)
    }
  }

  const getLatLngByAddress = async () => {
    try {
      const result = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${apiKey}`)
      const { lat, lon } = result.data.features[0].properties
      dispatch(setLocation({ lat, lon }))
    } catch (error) {
      console.log(error)
    }
  }

  const handlePlaceOrder = async () => {
    try {
      const result = await axios.post(`${serverUrl}/api/order/place-order`, {
        paymentMethod,
        deliveryAddress: { text: addressInput, latitude: location.lat, longitude: location.lon },
        totalAmount: AmountWithDeliveryFee,
        cartItems
      }, { withCredentials: true })

      if(paymentMethod == "cod"){
          dispatch(addMyOrder(result.data))
          navigate("/order-placed")
      } else {
          openRazorpayWindow(result.data.orderId, result.data.razorOrder)
       }
    } catch (error) {
      console.log(error)
    }
  }

const openRazorpayWindow = (orderId, razorOrder) => {
  const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorOrder.amount,
      currency: 'INR',
      name: "Gastronomy",
      description: "Premium Food Delivery",
      order_id: razorOrder.id,
      handler: async function (response) {
          try {
            const result = await axios.post(`${serverUrl}/api/order/verify-payment`, {
              razorpay_payment_id: response.razorpay_payment_id,
              orderId
            }, { withCredentials: true })
            dispatch(addMyOrder(result.data))
            navigate("/order-placed")
          } catch (error) {
            console.log(error)
          }
      }
  }
  const rzp = new window.Razorpay(options)
  rzp.open()
}

  useEffect(() => {
    setAddressInput(address)
  }, [address])

  return (
    <div className='min-h-screen bg-[#fff9f6] dark:bg-[#121212] flex justify-center p-6 pt-24 transition-colors duration-300'>
      <div className='w-full max-w-[900px]'>
          
        <div className='flex items-center gap-[15px] mb-8'>
            <button className='z-[10] bg-white dark:bg-[#1e1e1e] p-2 rounded-full shadow-md border border-gray-100 dark:border-gray-800 hover:scale-105 transition-transform cursor-pointer' onClick={() => navigate("/cart")}>
                <IoIosArrowRoundBack size={30} className='text-[#ff4d2d] dark:text-[#f97316]' />
            </button>
            <h1 className='text-3xl font-extrabold text-gray-900 dark:text-white'>Checkout</h1>
        </div>

        <div className='bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-xl p-8 border border-transparent dark:border-gray-800 space-y-8 transition-colors duration-300'>
            
            <section>
              <h2 className='text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-100'><IoLocationSharp className='text-[#ff4d2d] dark:text-[#f97316]' /> Delivery Location</h2>
              <div className='flex gap-3 mb-4'>
                <input type="text" className='flex-1 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#2a2a2a] dark:text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#ff4d2d] transition-colors' placeholder='Enter Your Delivery Address..' value={addressInput} onChange={(e) => setAddressInput(e.target.value)} />
                <button className='bg-[#ff4d2d] hover:bg-[#e64526] text-white px-4 py-3 rounded-xl flex items-center justify-center transition-colors shadow-md' onClick={getLatLngByAddress}><IoSearchOutline size={20} /></button>
                <button className='bg-gray-800 hover:bg-black dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-4 py-3 rounded-xl flex items-center justify-center transition-colors shadow-md' onClick={getCurrentLocation} title="Use Current Location"><TbCurrentLocation size={20} /></button>
              </div>
              <div className='rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-inner'>
                <div className='h-[300px] w-full z-0 relative'>
                  <MapContainer className={"w-full h-full"} center={[location?.lat, location?.lon]} zoom={16}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <RecenterMap location={location} />
                    <Marker position={[location?.lat, location?.lon]} draggable eventHandlers={{ dragend: onDragEnd }} />
                  </MapContainer>
                </div>
              </div>
            </section>

            <section>
              <h2 className='text-xl font-bold mb-4 text-gray-800 dark:text-gray-100'>Payment Method</h2>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className={`flex items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all cursor-pointer ${paymentMethod === "cod" ? "border-[#ff4d2d] dark:border-[#f97316] bg-orange-50 dark:bg-orange-900/10 shadow-md" : "border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 bg-gray-50 dark:bg-[#2a2a2a]"}`} onClick={() => setPaymentMethod("cod")}>
                  <span className='inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30'>
                    <MdDeliveryDining className='text-green-600 dark:text-green-400 text-2xl' />
                  </span>
                  <div>
                    <p className='font-bold text-gray-800 dark:text-gray-200'>Cash On Delivery</p>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>Pay when your food arrives</p>
                  </div>
                </div>
                
                <div className={`flex items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all cursor-pointer ${paymentMethod === "online" ? "border-[#ff4d2d] dark:border-[#f97316] bg-orange-50 dark:bg-orange-900/10 shadow-md" : "border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 bg-gray-50 dark:bg-[#2a2a2a]"}`} onClick={() => setPaymentMethod("online")}>
                  <div className="flex -space-x-3">
                      <span className='inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 ring-2 ring-white dark:ring-[#1e1e1e] z-10'>
                        <FaCreditCard className='text-blue-600 dark:text-blue-400 text-lg' />
                      </span>
                      <span className='inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 ring-2 ring-white dark:ring-[#1e1e1e]'>
                        <FaMobileScreenButton className='text-purple-600 dark:text-purple-400 text-lg' />
                      </span>
                  </div>
                  <div>
                    <p className='font-bold text-gray-800 dark:text-gray-200'>Pay Online</p>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>UPI / Credit / Debit Card</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className='text-xl font-bold mb-4 text-gray-800 dark:text-gray-100'>Order Summary</h2>
              <div className='rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2a2a2a] p-6 space-y-3 transition-colors duration-300'>
                {cartItems.map((item, index)=>(
                  <div key={index} className='flex justify-between text-base font-medium text-gray-700 dark:text-gray-300'>
                    <span>{item.name} <span className="text-gray-400 mx-1">x</span> {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
                
                <hr className='border-gray-200 dark:border-gray-600 my-4'/>
                
                <div className='flex justify-between font-bold text-gray-800 dark:text-gray-200 text-lg'>
                  <span>Subtotal</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className='flex justify-between text-gray-600 dark:text-gray-400 font-medium'>
                  <span>Delivery Fee</span>
                  <span className={deliveryFee == 0 ? "text-green-500" : ""}>{deliveryFee == 0 ? "Free" : `₹${deliveryFee}`}</span>
                </div>
                
                <div className='flex justify-between text-2xl font-black text-[#ff4d2d] dark:text-[#f97316] pt-4 mt-2 border-t border-gray-200 dark:border-gray-600'>
                  <span>Total</span>
                  <span>₹{AmountWithDeliveryFee}</span>
                </div>
              </div>
            </section>
            
            <button className='w-full bg-gradient-to-r from-[#ff4d2d] to-[#e64526] hover:from-[#e64526] hover:to-[#cc3e22] text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer' onClick={handlePlaceOrder}> 
                {paymentMethod == "cod" ? "Place Order" : "Pay & Place Order"}
            </button>
        </div>
      </div>
    </div>
  )
}

export default CheckOut