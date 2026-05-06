import axios from 'axios';
import React from 'react'
import { FaPen, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setMyShopData } from '../redux/ownerSlice';

function OwnerItemCard({data}) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    const handleDelete = async () => {
      if(window.confirm("Are you sure you want to delete this item?")) {
        try {
          const result = await axios.get(`${serverUrl}/api/item/delete/${data._id}`, {withCredentials:true})
          dispatch(setMyShopData(result.data))
        } catch (error) { console.log(error) }
      }
    }
    
  return (
    <div className='flex flex-col sm:flex-row bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-lg hover:shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800 w-full transition-all duration-300'>
      <div className='sm:w-48 h-48 sm:h-auto flex-shrink-0 bg-gray-100 dark:bg-[#2a2a2a] relative'>
        <div className="absolute top-2 left-2 z-10 bg-white/90 dark:bg-black/70 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
            {data.foodType == "veg" ? "🟢 Veg" : "🔴 Non-Veg"}
        </div>
        <img src={data.image} alt={data.name} className='w-full h-full object-cover'/>
      </div>
      
      <div className='flex flex-col justify-between p-5 flex-1'>
          <div className="mb-4">
            <h2 className='text-xl font-black text-gray-900 dark:text-white mb-2 leading-tight'>{data.name}</h2>
            <div className="flex gap-2">
                <span className='font-bold text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-800/50 uppercase tracking-wide'>
                    {data.category}
                </span>
            </div>
          </div>
          
          <div className='flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4'>
            <div className='text-2xl text-green-600 dark:text-green-500 font-black'>₹{data.price}</div>
            
            <div className='flex items-center gap-3'>
                <button className='flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-xl transition-colors font-bold shadow-sm border border-blue-100 dark:border-blue-800/50 cursor-pointer' onClick={() => navigate(`/edit-item/${data._id}`)}>
                    <FaPen size={14}/> Edit
                </button>
                <button className='w-10 h-10 flex justify-center items-center bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500 rounded-xl transition-colors shadow-sm border border-red-100 dark:border-red-800/50 cursor-pointer' onClick={handleDelete} title="Delete Item">
                    <FaTrashAlt size={16}/>
                </button>
            </div>
          </div>
      </div>
    </div>
  )
}

export default OwnerItemCard