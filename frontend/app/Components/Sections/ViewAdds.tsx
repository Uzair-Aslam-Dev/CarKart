'use client'
import React, { useEffect, useState } from 'react'
import ViewListingCard from '../Cards/ViewListingCard'
import { Car, CircleCheck, Clock } from 'lucide-react'
import ListingComponent from './ListingComponent'

type Listing = {
  img: string
  brand: string
  model: string
  mileage: string
  price: string
  status: string
  date: string
}

function ViewAdds() {
  const [listingdata, setlisting] = useState<Listing[]>([])

  useEffect(() => {
    const getlistingdata = async () => {
      try {
        const res = await fetch("http://localhost:5000/users/mylistings", {
          method: 'GET',
          credentials: 'include'
        })

        if (res.ok) {
          const result = await res.json();
          const transformed = result.data.map((item: any) => ({
            img: `http://localhost:5000/uploads/${item.image_url}`,
            brand: item.brand,
            model: item.model,
            mileage: `${Number(item.mileage).toLocaleString()} miles`,
            price: `Rs ${parseFloat(item.price).toLocaleString()}`,
            status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
            date: new Date(item.created_at).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric'
            })
          }));
          setlisting(transformed);
        } else {
          setlisting([]);
        }
      } catch (e) {
        console.error(e);
      }
    }

    getlistingdata();
  }, [])

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

    <div className='bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-3 max-h-[400px] overflow-y-auto'>
  {listingdata.length === 0
    ? <p className='text-gray-400 text-sm'>No listings found.</p>
    : listingdata.map((item, index) => (
        <ListingComponent
          key={index}
          img={item.img}
          brand={item.brand}
          model={item.model}
          mileage={item.mileage}
          price={item.price}
          status={item.status}
          date={item.date}
        />
      ))
  }
</div>

    </div>
  )
}

export default ViewAdds