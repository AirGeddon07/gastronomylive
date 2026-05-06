import React, { useEffect, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FaUtensils } from "react-icons/fa";
import axios from 'axios';
import { serverUrl } from '../App';
import { setMyShopData } from '../redux/ownerSlice';
import { ClipLoader } from 'react-spinners';

function EditItem() {
    const navigate = useNavigate()
    const { myShopData } = useSelector(state => state.owner)
    const { itemId } = useParams()
    const [currentItem, setCurrentItem] = useState(null)
    const [name, setName] = useState("")
    const [price, setPrice] = useState(0)
    const [frontendImage, setFrontendImage] = useState("")
    const [backendImage, setBackendImage] = useState(null)
    const [category, setCategory] = useState("")
    const [foodType, setFoodType] = useState("")
    const [loading, setLoading] = useState(false)
    
    const categories = ["Snacks", "Main Course", "Desserts", "Pizza", "Burgers", "Sandwiches", "South Indian", "North Indian", "Chinese", "Fast Food", "Others"]
    const dispatch = useDispatch()
    
    const handleImage = (e) => {
        const file = e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("name", name)
            formData.append("category", category)
            formData.append("foodType", foodType)
            formData.append("price", price)
            if (backendImage) {
                formData.append("image", backendImage)
            }
            const result = await axios.post(`${serverUrl}/api/item/edit-item/${itemId}`, formData, { withCredentials: true })
            dispatch(setMyShopData(result.data))
            setLoading(false)
            navigate("/")
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    useEffect(() => {
        const handleGetItemById = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/item/get-by-id/${itemId}`, { withCredentials: true })
                setCurrentItem(result.data)
            } catch (error) {
                console.log(error)
            }
        }
        handleGetItemById()
    }, [itemId])

    useEffect(() => {
        setName(currentItem?.name || "")
        setPrice(currentItem?.price || 0)
        setCategory(currentItem?.category || "")
        setFoodType(currentItem?.foodType || "")
        setFrontendImage(currentItem?.image || "")
    }, [currentItem])

    return (
        <div className='min-h-screen flex justify-center items-center p-6 bg-[#fff9f6] dark:bg-[#121212] transition-colors duration-300 py-24'>
            <button className='fixed top-[100px] left-4 md:left-8 z-20 flex items-center gap-2 bg-white dark:bg-[#1e1e1e] text-gray-800 dark:text-white px-4 py-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-800 hover:scale-105 transition-transform' onClick={() => navigate("/")}>
                <IoIosArrowRoundBack size={26} className='text-[#ff4d2d] dark:text-[#f97316]' />
                <span className="font-bold pr-2">Back</span>
            </button>

            <div className='max-w-xl w-full bg-white dark:bg-[#1e1e1e] shadow-2xl rounded-3xl p-8 md:p-10 border border-gray-100 dark:border-gray-800 transition-colors duration-300 mt-8'>
                <div className='flex flex-col items-center mb-8'>
                    <div className='bg-orange-50 dark:bg-orange-900/20 p-5 rounded-full mb-4 ring-4 ring-orange-100 dark:ring-orange-900/10'>
                        <FaUtensils className='text-[#ff4d2d] dark:text-[#f97316] w-12 h-12' />
                    </div>
                    <div className="text-3xl font-black text-gray-900 dark:text-white">
                        Edit Item
                    </div>
                </div>
                
                <form className='space-y-6' onSubmit={handleSubmit}>
                    <div>
                        <label className='block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2'>Item Name</label>
                        <input type="text" placeholder='Enter Food Name' className='w-full px-4 py-3 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff4d2d] transition-colors' onChange={(e) => setName(e.target.value)} value={name} required/>
                    </div>
                    
                    <div>
                        <label className='block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2'>Food Image</label>
                        <input type="file" accept='image/*' className='w-full px-4 py-3 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 dark:text-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff4d2d] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-[#ff4d2d] hover:file:bg-orange-100' onChange={handleImage} />
                        {frontendImage && <div className='mt-4 overflow-hidden rounded-2xl border-2 border-gray-100 dark:border-gray-700 shadow-sm'>
                            <img src={frontendImage} alt="Preview" className='w-full h-56 object-cover hover:scale-105 transition-transform duration-500' />
                        </div>}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className='block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2'>Price (₹)</label>
                            <input type="number" placeholder='0' className='w-full px-4 py-3 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]' onChange={(e) => setPrice(e.target.value)} value={price} required/>
                        </div>
                        
                        <div>
                            <label className='block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2'>Select Food Type</label>
                            <select className='w-full px-4 py-3 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]' onChange={(e) => setFoodType(e.target.value)} value={foodType} required>
                                <option value="veg">Vegetarian 🟢</option>
                                <option value="non veg">Non-Vegetarian 🔴</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className='block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2'>Category</label>
                        <select className='w-full px-4 py-3 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]' onChange={(e) => setCategory(e.target.value)} value={category} required>
                            <option value="">Select Category</option>
                            {categories.map((cate, index) => (
                                <option value={cate} key={index}>{cate}</option>
                            ))}
                        </select>
                    </div>

                    <button className='w-full mt-4 bg-gradient-to-r from-[#ff4d2d] to-[#e64526] hover:from-[#e64526] hover:to-[#cc3e22] text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex justify-center items-center' disabled={loading}>
                        {loading ? <ClipLoader size={24} color='white' /> : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default EditItem