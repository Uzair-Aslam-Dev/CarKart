import React from 'react'

interface Cardprops {
  icon: React.ReactNode
  text: string
  numeric: number
}

function ViewListingCard({ icon, text, numeric }: Cardprops) {
  return (
    <div className='bg-white rounded-2xl shadow-sm p-4 w-60'>
      
      <div className='bg-blue-100 p-3 rounded-xl w-fit'>
        {icon}
      </div>

      <div className='mt-4 flex flex-col'>
        <span className='text-gray-500 text-sm font-medium'>
          {text}
        </span>
        <span className='text-2xl font-bold'>
          {numeric}
        </span>
      </div>

    </div>
  )
}

export default ViewListingCard