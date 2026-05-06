import React, { useEffect, useState } from 'react'
import { FaLocationDot, FaPlus } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { FiShoppingCart, FiSun, FiMoon } from "react-icons/fi"; // ✨ NEW: Added Sun & Moon icons
import { TbReceipt2 } from "react-icons/tb";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { setSearchItems, setUserData, toggleTheme } from '../redux/userSlice'; // ✨ NEW: Imported toggleTheme

function Nav() {
    // ✨ NEW: Pulled isDarkMode from Redux
    const { userData, currentCity, cartItems, isDarkMode } = useSelector(state => state.user)
    const { myShopData } = useSelector(state => state.owner)
    const [showInfo, setShowInfo] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [query, setQuery] = useState("")
    
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogOut = async () => {
        try {
            await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true })
            dispatch(setUserData(null))
        } catch (error) {
            console.log(error)
        }
    }

    const handleSearchItems = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/item/search-items?query=${query}&city=${currentCity}`, { withCredentials: true })
        dispatch(setSearchItems(result.data))
      } catch (error) {
        console.log(error)
      }
    }

    useEffect(() => {
        if (query) {
            handleSearchItems()
        } else {
            dispatch(setSearchItems(null))
        }
    }, [query])

    return (
        // ✨ NEW: Added dark mode classes and backdrop-blur for a glassmorphism aesthetic
        <div className='w-full h-[80px] flex items-center justify-between md:justify-center gap-[30px] px-[20px] fixed top-0 z-[9999] bg-[#fff9f6]/90 dark:bg-[#1a1a1a]/80 backdrop-blur-md shadow-sm transition-colors duration-300'>

            {showSearch && userData.role == "user" && <div className='w-[90%] h-[70px] bg-white dark:bg-[#2a2a2a] shadow-xl rounded-lg items-center gap-[20px] flex fixed top-[80px] left-[5%] md:hidden transition-colors duration-300'>
                <div className='flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-300 dark:border-gray-600'>
                    <FaLocationDot size={25} className="text-[#ff4d2d] dark:text-[#f97316]" />
                    <div className='w-[80%] truncate text-gray-600 dark:text-gray-300'>{currentCity}</div>
                </div>
                <div className='w-[80%] flex items-center gap-[10px]'>
                    <IoIosSearch size={25} className='text-[#ff4d2d] dark:text-[#f97316]' />
                    <input type="text" placeholder='search delicious food...' className='px-[10px] text-gray-700 dark:text-gray-200 bg-transparent outline-0 w-full' onChange={(e)=>setQuery(e.target.value)} value={query}/>
                </div>
            </div>}

            {/* ✨ NEW: Brand Name Changed */}
            <h1 className='text-3xl font-extrabold mb-2 tracking-tight text-[#ff4d2d] dark:text-[#f97316] drop-shadow-sm cursor-pointer' onClick={() => navigate("/")}>
                Gastronomy
            </h1>

            {userData.role == "user" && <div className='md:w-[60%] lg:w-[40%] h-[50px] bg-white dark:bg-[#2a2a2a] shadow-md hover:shadow-lg rounded-full items-center gap-[20px] hidden md:flex transition-all duration-300 border border-gray-100 dark:border-gray-700'>
                <div className='flex items-center w-[30%] overflow-hidden gap-[10px] px-[15px] border-r-[2px] border-gray-200 dark:border-gray-600'>
                    <FaLocationDot size={20} className="text-[#ff4d2d] dark:text-[#f97316]" />
                    <div className='w-[80%] truncate text-sm font-medium text-gray-600 dark:text-gray-300'>{currentCity}</div>
                </div>
                <div className='w-[80%] flex items-center gap-[10px] pr-4'>
                    <IoIosSearch size={22} className='text-gray-400 dark:text-gray-500' />
                    <input type="text" placeholder='Search smart recommendations...' className='text-sm text-gray-700 dark:text-gray-200 bg-transparent outline-0 w-full' onChange={(e)=>setQuery(e.target.value)} value={query}/>
                </div>
            </div>}

            <div className='flex items-center gap-5'>
                {userData.role == "user" && (showSearch ? <RxCross2 size={25} className='text-[#ff4d2d] dark:text-[#f97316] md:hidden cursor-pointer' onClick={() => setShowSearch(false)} /> : <IoIosSearch size={25} className='text-[#ff4d2d] dark:text-[#f97316] md:hidden cursor-pointer' onClick={() => setShowSearch(true)} />)
                }
                
                {/* ✨ NEW: Dark Mode Toggle Button */}
                <button 
                    onClick={() => dispatch(toggleTheme())} 
                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-yellow-400 transition-colors duration-300 hover:scale-110"
                    title="Toggle Theme"
                >
                    {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
                </button>

                {userData.role == "owner"? <>
                 {myShopData && <> <button className='hidden md:flex items-center gap-1 p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 dark:bg-[#f97316]/20 text-[#ff4d2d] dark:text-[#f97316] transition-colors' onClick={()=>navigate("/add-item")}>
                        <FaPlus size={20} />
                        <span className="font-medium">Add Food Item</span>
                    </button>
                      <button className='md:hidden flex items-center p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 dark:bg-[#f97316]/20 text-[#ff4d2d] dark:text-[#f97316]' onClick={()=>navigate("/add-item")}>
                        <FaPlus size={20} />
                    </button></>}
                   
                    <div className='hidden md:flex items-center gap-2 cursor-pointer relative px-3 py-2 rounded-lg bg-[#ff4d2d]/10 dark:bg-[#f97316]/20 text-[#ff4d2d] dark:text-[#f97316] font-medium transition-colors' onClick={()=>navigate("/my-orders")}>
                      <TbReceipt2 size={20}/>
                      <span>My Orders</span>
                    </div>
                     <div className='md:hidden flex items-center gap-2 cursor-pointer relative px-3 py-2 rounded-lg bg-[#ff4d2d]/10 dark:bg-[#f97316]/20 text-[#ff4d2d] dark:text-[#f97316] font-medium' onClick={()=>navigate("/my-orders")}>
                      <TbReceipt2 size={20}/>
                    </div>
                </>: (
                    <>
                 {userData.role=="user" && <div className='relative cursor-pointer hover:scale-110 transition-transform' onClick={()=>navigate("/cart")}>
                    <FiShoppingCart size={25} className='text-[#ff4d2d] dark:text-[#f97316]' />
                    <span className='absolute right-[-10px] top-[-10px] bg-[#ff4d2d] dark:bg-[#f97316] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm'>{cartItems.length}</span>
                </div>}   

                <button className='hidden md:block px-4 py-2 rounded-lg bg-[#ff4d2d]/10 dark:bg-[#f97316]/20 text-[#ff4d2d] dark:text-[#f97316] text-sm font-bold transition-colors hover:bg-[#ff4d2d]/20 dark:hover:bg-[#f97316]/30' onClick={()=>navigate("/my-orders")}>
                    My Orders
                </button>
                    </>
                )}

                <div className='w-[42px] h-[42px] rounded-full flex items-center justify-center bg-gradient-to-tr from-[#ff4d2d] to-[#ff7a00] dark:from-[#ea580c] dark:to-[#f97316] text-white text-[18px] shadow-lg font-bold cursor-pointer hover:ring-4 ring-[#ff4d2d]/30 transition-all' onClick={() => setShowInfo(prev => !prev)}>
                    {userData?.fullName.slice(0, 1)}
                </div>
                
                {showInfo && <div className={`fixed top-[85px] right-[10px] 
                    ${userData.role=="deliveryBoy"?"md:right-[20%] lg:right-[40%]":"md:right-[10%] lg:right-[10%]"} w-[200px] bg-white dark:bg-[#2a2a2a] shadow-2xl rounded-2xl p-[20px] flex flex-col gap-[12px] z-[9999] border border-gray-100 dark:border-gray-700 transition-colors duration-300`}>
                    <div className='text-[16px] font-bold text-gray-800 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 pb-2'>{userData.fullName}</div>
                    {userData.role=="user" && <div className='md:hidden text-sm text-[#ff4d2d] dark:text-[#f97316] font-semibold cursor-pointer hover:underline' onClick={()=>navigate("/my-orders")}>My Orders</div>}
                    
                    <div className='text-sm text-red-500 dark:text-red-400 font-semibold cursor-pointer hover:underline' onClick={handleLogOut}>Log Out</div>
                </div>}

            </div>
        </div>
    )
}

export default Nav