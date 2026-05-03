'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import DashNav from '../Components/Sections/DashNav'
import BuyerNav from '../Components/Sections/BuyerNav'
import BuyerDashboard from '../Components/Sections/BuyerDashboard'
import BuyerVehicles from '../Components/Sections/BuyerVehicles'
import Newadd from '../Components/Forms/Newadd'
import ViewAdds from '../Components/Sections/ViewAdds'
import BuyerOrders from '../Components/Sections/BuyerOrders'

// Separate view types (IMPORTANT)
type SellerView = 'view' | 'edit' | 'create'
type BuyerView = 'Browse Vehicles' | 'Dashboard' | 'My Orders' | 'Wishlist'

function Page() {
  const [sellerView, setSellerView] = useState<SellerView>('view')
  const [buyerView, setBuyerView] = useState<BuyerView>('Browse Vehicles')

  const [role, setRole] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch("http://localhost:5000/users/me", {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setRole(data.user.role)
      } else {
        router.push('/login')
      }
    }

    fetchUser()
  }, [])

  if (!role) return <div>Loading...</div>

  return (
    <div className='flex w-full h-screen'>

      {/* SELLER */}
      {role === 'seller' && (
        <>
          <DashNav setview={setSellerView} />

          <div className='flex-1 bg-gray-100 p-4'>
            {sellerView === 'view' && <ViewAdds/>}
            {sellerView === 'edit' && <h1>Editing Ad</h1>}
            {sellerView === 'create' && <Newadd />}
          </div>
        </>
      )}

      {/* BUYER */}
      {role === 'buyer' && (
        <>
          <BuyerNav setView={setBuyerView} />

          <div className="flex-1 bg-gray-100 p-6 overflow-auto">
            {buyerView === 'Browse Vehicles' && <BuyerVehicles />}
            {buyerView === 'Dashboard' && <BuyerDashboard />}
            {buyerView === 'My Orders' && <BuyerOrders />}
            {buyerView === 'Wishlist' && <h1>Wishlist Page</h1>}
          </div>
        </>
      )}
  
    </div>
  )
}

export default Page