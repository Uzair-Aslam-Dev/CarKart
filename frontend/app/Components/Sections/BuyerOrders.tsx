'use client'
import React, { useState, useEffect } from 'react'

type OrderStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

interface Order {
  order_id: number
  total_price: string
  status: OrderStatus
  created_at: string
}

const BADGE_STYLES: Record<OrderStatus, string> = {
  pending:   'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending', confirmed: 'Approved', completed: 'Completed', cancelled: 'Cancelled',
}

function BuyerOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('http://localhost:5000/users/orders', { credentials: 'include' })
        const data = await res.json()
        console.log(data)
        setOrders(data.orders ?? [])
      } catch (err) {
        console.error('Error fetching orders:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  return (
    <div className="space-y-4">

      <div>
        <h1 className="text-2xl font-semibold">My Orders</h1>
        <p className="text-gray-500 text-sm">Track and manage all your orders in one place.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* TABLE HEADER */}
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-gray-500 text-left">
              <th className="px-5 py-3 font-medium">Order ID</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Total</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
        </table>

        {/* SCROLLABLE BODY */}
        <div className="overflow-y-auto max-h-[60vh]">
          <table className="w-full text-sm">
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">Loading...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">No orders yet.</td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order.order_id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-5 py-4 font-medium">
                      #ORD-{String(order.order_id).padStart(4, '0')}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        month: 'short', day: '2-digit', year: 'numeric'
                      })}
                    </td>
                    <td className="px-5 py-4 font-medium">
                      PKR-{Number(order.total_price).toFixed(2)}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${BADGE_STYLES[order.status]}`}>
                        {STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-blue-600 cursor-pointer hover:underline">View</span>
                      <span className="text-gray-300 mx-2">|</span>
                      <span className="text-blue-600 cursor-pointer hover:underline">Track</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

export default BuyerOrders