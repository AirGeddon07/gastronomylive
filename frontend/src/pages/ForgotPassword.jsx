import axios from 'axios';
import React, { useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { ClipLoader } from 'react-spinners';

function ForgotPassword() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [err, setErr] = useState("")
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSendOtp = async () => {
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/auth/send-otp`, {email}, {withCredentials:true})
      setErr("")
      setStep(2)
      setLoading(false)
    } catch (error) {
       setErr(error.response.data.message)
       setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
      setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/auth/verify-otp`, {email, otp}, {withCredentials:true})
      setErr("")
      setStep(3)
      setLoading(false)
    } catch (error) {
        setErr(error?.response?.data?.message)
        setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if(newPassword != confirmPassword){
      setErr("Passwords do not match!")
      return null
    }
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/auth/reset-password`, {email, newPassword}, {withCredentials:true})
      setErr("")
      setLoading(false)
      navigate("/signin")
    } catch (error) {
       setErr(error?.response?.data?.message)
       setLoading(false)
    }
  }

  return (
    <div className='min-h-screen w-full flex items-center justify-center p-4 bg-[#fff9f6] dark:bg-[#121212] transition-colors duration-300'>
      <div className='bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-xl w-full max-w-md p-8 border border-gray-100 dark:border-gray-800 transition-colors duration-300'>
        
        <div className='flex items-center gap-4 mb-8 border-b border-gray-100 dark:border-gray-800 pb-4'>
          <button className="bg-gray-50 dark:bg-[#2a2a2a] p-2 rounded-full hover:scale-105 transition-transform" onClick={() => navigate("/signin")}>
             <IoIosArrowRoundBack size={26} className='text-[#ff4d2d] dark:text-[#f97316] cursor-pointer' />
          </button>
          <h1 className='text-2xl font-extrabold text-gray-900 dark:text-white'>Reset Password</h1>
        </div>

        {step == 1 && (
          <div className="space-y-6">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Enter the email address associated with your account and we'll send you a verification code.</p>
            <div>
                <label htmlFor="email" className='block text-gray-700 dark:text-gray-300 font-bold mb-2'>Email Address</label>
                <input type="email" className='w-full border border-gray-300 dark:border-gray-700 bg-transparent dark:bg-[#2a2a2a] dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ff4d2d] transition-colors' placeholder='Enter your Email' onChange={(e) => setEmail(e.target.value)} value={email} required/>
            </div>
            <button className='w-full font-bold py-3 rounded-xl transition duration-300 bg-[#ff4d2d] dark:bg-[#ea580c] text-white hover:bg-[#e64323] dark:hover:bg-[#f97316] shadow-lg hover:shadow-xl cursor-pointer flex justify-center items-center' onClick={handleSendOtp} disabled={loading}>
                {loading ? <ClipLoader size={20} color='white'/> : "Send Code"}
            </button>
            {err && <p className='text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg text-center mt-2 text-sm font-medium'>*{err}</p>}
          </div>
        )}

        {step == 2 && (
          <div className="space-y-6">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">We've sent a 6-digit verification code to <span className="font-bold text-gray-800 dark:text-gray-200">{email}</span>.</p>
            <div>
                <label htmlFor="otp" className='block text-gray-700 dark:text-gray-300 font-bold mb-2'>Verification Code (OTP)</label>
                <input type="text" className='w-full border border-gray-300 dark:border-gray-700 bg-transparent dark:bg-[#2a2a2a] dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ff4d2d] transition-colors tracking-widest text-lg font-bold text-center' placeholder='• • • • • •' onChange={(e) => setOtp(e.target.value)} value={otp} required/>
            </div>
            <button className='w-full font-bold py-3 rounded-xl transition duration-300 bg-[#ff4d2d] dark:bg-[#ea580c] text-white hover:bg-[#e64323] dark:hover:bg-[#f97316] shadow-lg hover:shadow-xl cursor-pointer flex justify-center items-center' onClick={handleVerifyOtp} disabled={loading}>
                {loading ? <ClipLoader size={20} color='white'/> : "Verify Code"}
            </button>
            {err && <p className='text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg text-center mt-2 text-sm font-medium'>*{err}</p>}
          </div>
        )}

        {step == 3 && (
          <div className="space-y-6">
             <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Create a new, strong password for your account.</p>
            <div>
                <label htmlFor="newPassword" className='block text-gray-700 dark:text-gray-300 font-bold mb-2'>New Password</label>
                <input type="password" className='w-full border border-gray-300 dark:border-gray-700 bg-transparent dark:bg-[#2a2a2a] dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ff4d2d] transition-colors' placeholder='Enter New Password' onChange={(e) => setNewPassword(e.target.value)} value={newPassword}/>
            </div>
            <div>
                <label htmlFor="ConfirmPassword" className='block text-gray-700 dark:text-gray-300 font-bold mb-2'>Confirm Password</label>
                <input type="password" className='w-full border border-gray-300 dark:border-gray-700 bg-transparent dark:bg-[#2a2a2a] dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ff4d2d] transition-colors' placeholder='Confirm Password' onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} required/>
            </div>
            <button className='w-full mt-4 font-bold py-3 rounded-xl transition duration-300 bg-[#ff4d2d] dark:bg-[#ea580c] text-white hover:bg-[#e64323] dark:hover:bg-[#f97316] shadow-lg hover:shadow-xl cursor-pointer flex justify-center items-center' onClick={handleResetPassword} disabled={loading}>
                {loading ? <ClipLoader size={20} color='white'/> : "Update Password"}
            </button>
            {err && <p className='text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg text-center mt-2 text-sm font-medium'>*{err}</p>}
          </div>
        )}

      </div>
    </div>
  )
}

export default ForgotPassword