'use client'
import React from 'react'
import { Home, Edit, PlusCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
type ViewType = 'view' | 'edit' | 'create'
interface dashprops{
  setview: React.Dispatch<React.SetStateAction<ViewType>>
}

function DashNav({setview} : dashprops) {
  const router = useRouter();
  const handlelogout = async () => {
    const response = await fetch('http://localhost:5000/users/logout' , {method : 'POST' , credentials : 'include'})

    if(response.ok) {
      const result = await response;
      console.log(result)
      router.push('/login')

    }
  }
  return (
    <div className='h-full w-64 bg-linear-to-b from-blue-600 to-blue-800 text-white flex flex-col shadow-lg'>
      
      
      <div className='px-6 py-6 border-b border-blue-400'>
        <h1 className='text-xl font-semibold'>Dashboard</h1>
        <p className='text-sm text-blue-200'>Welcome User</p>
      </div>


      <div className='flex flex-col gap-2 px-4 py-4'>

        <button className='flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200' onClick={()=>{setview('view')}}>
          <Home size={18} />
          <span>View My Ads</span>
        </button>

        <button className='flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200' onClick={()=>{setview('edit')}}>
          <Edit size={18} />
          <span>Edit My Ad</span>
        </button>

        <button className='flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200' onClick={()=>{setview('create')}}>
          <PlusCircle size={18} />
          <span>Create New Ad</span>
        </button>

      </div>

      {/* Bottom Section (optional) */}
      <div className='mt-auto px-4 py-4 border-t border-blue-400'>
        <button className='w-full text-left px-4 py-2 rounded-lg hover:bg-red-500 transition-all duration-200' onClick={handlelogout}>
          Logout
        </button>
      </div>

    </div>
  )
}

export default DashNav