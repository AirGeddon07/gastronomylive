import React from 'react'

function CategoryCard({name, image, onClick, isActive}) {
  return (
    <div 
        className={`w-[140px] h-[140px] md:w-[160px] md:h-[160px] rounded-[2rem] shrink-0 overflow-hidden bg-white dark:bg-[#1e1e1e] shadow-lg border-2 transition-all duration-300 relative group cursor-pointer 
        ${isActive ? 'border-[#ff4d2d] dark:border-[#f97316] shadow-[#ff4d2d]/30 scale-105' : 'border-transparent hover:border-[#ff4d2d] dark:hover:border-[#f97316] hover:shadow-[#ff4d2d]/20'}`} 
        onClick={onClick}
    >
        <img src={image} alt={name} className='w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500'/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className='absolute bottom-0 w-full left-0 px-3 py-4 text-center'>
            <span className={`font-extrabold text-sm md:text-base drop-shadow-md tracking-wide uppercase ${isActive ? 'text-[#ff4d2d]' : 'text-white'}`}>
                {name}
            </span>
        </div>
    </div>
  )
}

export default CategoryCard