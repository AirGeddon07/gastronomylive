import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { serverUrl } from '../App';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { ClipLoader } from "react-spinners"
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function SignUp() {
    const [showPassword, setShowPassword] = useState(false)
    const [role, setRole] = useState("user")
    const navigate = useNavigate()
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [mobile, setMobile] = useState("")
    const [err, setErr] = useState("")
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    
    const handleSignUp = async () => {
        setLoading(true)
        try {
            const result = await axios.post(`${serverUrl}/api/auth/signup`, {
                fullName, email, password, mobile, role
            }, { withCredentials: true })
            dispatch(setUserData(result.data))
            setErr("")
            setLoading(false)
        } catch (error) {
            setErr(error?.response?.data?.message)
            setLoading(false)
        }
    }

    const handleGoogleAuth = async () => {
        if (!mobile) return setErr("Mobile no. is required for Google Sign Up")
        const provider = new GoogleAuthProvider()
        const result = await signInWithPopup(auth, provider)
        try {
            const { data } = await axios.post(`${serverUrl}/api/auth/google-auth`, {
                fullName: result.user.displayName,
                email: result.user.email,
                role,
                mobile
            }, { withCredentials: true })
            dispatch(setUserData(data))
        } catch (error) {
            console.log(error)
        }
    }
    
    return (
        <div className='min-h-screen w-full flex items-center justify-center p-4 bg-[#fff9f6] dark:bg-[#121212] transition-colors duration-300 py-12'>
            <div className='bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-xl w-full max-w-md p-8 border border-gray-100 dark:border-gray-800 transition-colors duration-300'>
                <h1 className='text-4xl font-extrabold mb-2 text-[#ff4d2d] dark:text-[#f97316] tracking-tight'>Gastronomy</h1>
                <p className='text-gray-500 dark:text-gray-400 mb-8 font-medium'>Create your account to get started with premium food deliveries.</p>

                <div className='space-y-4'>
                    <div>
                        <label htmlFor="fullName" className='block text-gray-700 dark:text-gray-300 font-semibold mb-2'>Full Name</label>
                        <input type="text" className='w-full border border-gray-300 dark:border-gray-700 bg-transparent dark:bg-[#2a2a2a] dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]' placeholder='Enter your Full Name' onChange={(e) => setFullName(e.target.value)} value={fullName} required />
                    </div>

                    <div>
                        <label htmlFor="email" className='block text-gray-700 dark:text-gray-300 font-semibold mb-2'>Email</label>
                        <input type="email" className='w-full border border-gray-300 dark:border-gray-700 bg-transparent dark:bg-[#2a2a2a] dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]' placeholder='Enter your Email' onChange={(e) => setEmail(e.target.value)} value={email} required />
                    </div>

                    <div>
                        <label htmlFor="mobile" className='block text-gray-700 dark:text-gray-300 font-semibold mb-2'>Mobile</label>
                        <input type="tel" className='w-full border border-gray-300 dark:border-gray-700 bg-transparent dark:bg-[#2a2a2a] dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]' placeholder='Enter your Mobile Number' onChange={(e) => setMobile(e.target.value)} value={mobile} required />
                    </div>

                    <div>
                        <label htmlFor="password" className='block text-gray-700 dark:text-gray-300 font-semibold mb-2'>Password</label>
                        <div className='relative'>
                            <input type={`${showPassword ? "text" : "password"}`} className='w-full border border-gray-300 dark:border-gray-700 bg-transparent dark:bg-[#2a2a2a] dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ff4d2d] pr-10' placeholder='Create a password' onChange={(e) => setPassword(e.target.value)} value={password} required />
                            <button className='absolute right-4 cursor-pointer top-[16px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200' onClick={() => setShowPassword(prev => !prev)}>{!showPassword ? <FaRegEye size={18} /> : <FaRegEyeSlash size={18} />}</button>
                        </div>
                    </div>

                    <div>
                        <label className='block text-gray-700 dark:text-gray-300 font-semibold mb-2'>I am a...</label>
                        <div className='flex gap-2 bg-gray-50 dark:bg-[#2a2a2a] p-1 rounded-xl border border-gray-200 dark:border-gray-700'>
                            {["user", "owner", "deliveryBoy"].map((r) => (
                                <button key={r} className={`flex-1 rounded-lg px-2 py-2 text-center text-sm font-bold transition-all duration-200 cursor-pointer capitalize ${role === r ? 'bg-[#ff4d2d] text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`} onClick={() => setRole(r)}>
                                    {r === "deliveryBoy" ? "Driver" : r}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <button className='w-full mt-8 font-bold py-3 rounded-xl transition duration-300 bg-[#ff4d2d] dark:bg-[#ea580c] text-white hover:bg-[#e64323] dark:hover:bg-[#f97316] shadow-lg hover:shadow-xl cursor-pointer flex justify-center items-center' onClick={handleSignUp} disabled={loading}>
                    {loading ? <ClipLoader size={20} color='white' /> : "Create Account"}
                </button>
                
                {err && <p className='text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg text-center mt-4 text-sm font-medium'>*{err}</p>}

                <div className="flex items-center my-6">
                    <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
                    <span className="px-3 text-sm text-gray-400 font-medium">OR</span>
                    <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
                </div>

                <button className='w-full flex items-center justify-center gap-3 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 transition cursor-pointer duration-300 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] dark:text-gray-200 font-medium' onClick={handleGoogleAuth}>
                    <FcGoogle size={24} />
                    <span>Sign up with Google</span>
                </button>
                
                <p className='text-center mt-8 text-gray-600 dark:text-gray-400 font-medium cursor-pointer'>Already have an account? <span className='text-[#ff4d2d] dark:text-[#f97316] hover:underline font-bold' onClick={() => navigate("/signin")}>Sign In</span></p>
            </div>
        </div>
    )
}

export default SignUp