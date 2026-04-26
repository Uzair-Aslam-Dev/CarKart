'use client'

import React, { useEffect, useState } from 'react'
import CarDisplay from '../Cards/CarDisplay'

function BuyerVehicles() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch('http://localhost:5000/vehicles')
        const data = await res.json()
        console.log('image value:', data[0].image)  
        setVehicles(data)
      } catch (err) {
        console.error('Error fetching vehicles:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Browse Vehicles</h1>

      {loading ? (
        <p className="text-gray-500">Loading vehicles...</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {vehicles.map((v) => (
            <CarDisplay
              key={v.id}
              image={`http://localhost:5000/uploads/${v.image}`}
              price={v.price}
              year={v.year}
              title={v.title}
              mileage={v.mileage}
              url={`/vehicle/${v.listing_id}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default BuyerVehicles