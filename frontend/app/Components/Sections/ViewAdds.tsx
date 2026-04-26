import React from 'react'
import ViewListingCard from '../Cards/ViewListingCard'
import { Car, CircleCheck, Clock } from 'lucide-react'

function ViewAdds() {
  return (
    <div className='w-full flex flex-col gap-6 p-6 bg-gray-100 min-h-screen'>
      
   
      <div>
        <h1 className='text-2xl font-bold'>Seller Dashboard</h1>
        <p className='text-gray-500'>
          Welcome Back, Here is what is happening to your car listings
        </p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                <ViewListingCard
            icon={<Car size={24} className="text-blue-600" />}
            text='Total Cars Listed'
            numeric={24}
            />

            <ViewListingCard
            icon={<CircleCheck size={24} className="text-green-600" />}
            text='Cars Sold'
            numeric={10}
            />

            <ViewListingCard
            icon={<Clock size={24} className="text-yellow-600" />}
            text='Pending Requests'
            numeric={5}
            />

      </div>

      <div className='bg-white rounded-2xl p-6 shadow-sm'>
        <p className='text-gray-500'>
          Car listing component will go here...
        </p>
      </div>

    </div>
  )
}

export default ViewAdds