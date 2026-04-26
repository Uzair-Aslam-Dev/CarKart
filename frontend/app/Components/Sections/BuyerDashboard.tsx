'use client'
import React, { useState } from 'react'

type OrderStatus = 'Pending' | 'Approved' | 'Completed'

interface Order {
  id: string
  date: string
  items: number
  total: string
  status: OrderStatus
}

function BuyerDashboard() {
  const [activeTab, setActiveTab] = useState('All Orders')

  const orders: Order[] = [
    { id: '#ORD-2024-1247', date: 'Jan 18, 2025', items: 2, total: '$249.99', status: 'Pending' },
    { id: '#ORD-2024-1246', date: 'Jan 17, 2025', items: 1, total: '$89.50', status: 'Approved' },
    { id: '#ORD-2024-1245', date: 'Jan 15, 2025', items: 3, total: '$425.00', status: 'Completed' },
    { id: '#ORD-2024-1244', date: 'Jan 14, 2025', items: 1, total: '$159.99', status: 'Completed' },
    { id: '#ORD-2024-1243', date: 'Jan 12, 2025', items: 2, total: '$310.00', status: 'Pending' },
  ]

  const filteredOrders =
    activeTab === 'All Orders'
      ? orders
      : orders.filter(o => o.status === activeTab)

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Purchase History</h1>
        <p className="text-gray-500 text-sm">
          Track and manage all your orders in one place
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Total Orders" value="24" />
        <StatCard title="Pending Orders" value="3" />
        <StatCard title="Completed" value="18" />
        <StatCard title="Total Spent" value="$12,450" />
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-xl shadow-sm p-4">

        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">

          {/* TABS */}
          <div className="flex gap-2 flex-wrap">
            {['All Orders', 'Pending', 'Approved', 'Completed'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-md text-sm ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* FILTER BUTTONS */}
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded-md text-sm">
              Last 30 days
            </button>
            <button className="px-3 py-1 border rounded-md text-sm">
              Filter
            </button>
            <button className="px-3 py-1 border rounded-md text-sm">
              Export
            </button>
          </div>
        </div>

        {/* TABLE */}
        <table className="w-full text-sm">
          <thead className="text-gray-500 text-left">
            <tr>
              <th className="py-2">Order ID</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id} className="border-t hover:bg-gray-50">
                <td className="py-3 font-medium">{order.id}</td>
                <td>{order.date}</td>
                <td>{order.items} items</td>
                <td>{order.total}</td>

                <td>
                  <StatusBadge status={order.status} />
                </td>

                <td className="text-blue-600 space-x-2 cursor-pointer">
                  <span>View</span>
                  <span>Track</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* FOOTER */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
          <p>Showing 1 to {filteredOrders.length} of {orders.length} orders</p>

          <div className="flex gap-1">
            <button className="px-3 py-1 border rounded-md">{'<'}</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-md">1</button>
            <button className="px-3 py-1 border rounded-md">2</button>
            <button className="px-3 py-1 border rounded-md">3</button>
            <button className="px-3 py-1 border rounded-md">{'>'}</button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default BuyerDashboard

/* ---------------- COMPONENTS ---------------- */

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-xl font-semibold mt-1">{value}</h2>
    </div>
  )
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const styles = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Approved: 'bg-blue-100 text-blue-700',
    Completed: 'bg-green-100 text-green-700',
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${styles[status]}`}>
      {status}
    </span>
  )
}
