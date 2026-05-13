'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import DashNav from '../Components/Sections/DashNav'
import BuyerNav from '../Components/Sections/BuyerNav'
import BuyerDashboard from '../Components/Sections/BuyerDashboard'
import BuyerVehicles from '../Components/Sections/BuyerVehicles'
import Newadd from '../Components/Forms/Newadd'
import ViewAdds from '../Components/Sections/ViewAdds'
import ManageOrders from '../Components/Sections/ManageOrders'
import BuyerOrders from '../Components/Sections/BuyerOrders'
import BuyerWishlist from '../Components/Sections/BuyerWishlist'
import AdminNav from '../Components/Sections/AdminNav'
import AdminDashboard from '../Components/Sections/AdminDashboard'
import AdminUsers from '../Components/Sections/AdminUsers'
import AdminListings from '../Components/Sections/AdminListings'
import AdminOrders from '../Components/Sections/AdminOrders'

// Separate view types (IMPORTANT)
type SellerView = 'view' | 'edit' | 'create' | 'orders'
type BuyerView = 'Browse Vehicles' | 'Dashboard' | 'My Orders' | 'Wishlist'
type AdminView = 'Dashboard' | 'Users' | 'Listings' | 'Orders'

function Page() {
  const [sellerView, setSellerView] = useState<SellerView>('view')
  const [buyerView, setBuyerView] = useState<BuyerView>('Browse Vehicles')
  const [adminView, setAdminView] = useState<AdminView>('Dashboard')

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
            {sellerView === 'orders' && <ManageOrders />}
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
            {buyerView === 'Wishlist' && <BuyerWishlist/>}
          </div>
        </>
      )}

      {/* ADMIN */}
      {role === 'admin' && (
        <>
          <AdminNav setView={setAdminView} currentView={adminView}/>
          < div className="flex-1 bg-gray-100 p-6 overflow-auto">
            {adminView === 'Dashboard' && <AdminDashboard />}
            {adminView === 'Users' && <AdminUsers />}
            {adminView === 'Listings' && <AdminListings />}
            {adminView === 'Orders' && <AdminOrders />}
          </div>
        </>
      )}
  
    </div>
  )
}

export default Page