'use client'
import React, { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

type OrderStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

interface Order {
  order_id: number
  brand: string
  model: string
  year: number
  image_url: string | null
  total_price: string
  status: OrderStatus
  created_at: string
}

interface Stats {
  total_orders: number
  pending: number
  completed: number
  approved: number
  total_spent: string
}

const COLORS = ['#facc15', '#3b82f6', '#22c55e']

function BuyerDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  const fetchDashboard = async () => {
    try {
      const res = await fetch('http://localhost:5000/users/dashboard', { credentials: 'include' })
      const data = await res.json()
      console.log(data)
      setOrders(data.orders ?? [])
      setStats(data.stats ?? {
        total_orders: 0,
        pending: 0,
        completed: 0,
        approved: 0,
        total_spent: '0',
      })
    } catch (err) {
      console.error('Error fetching dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  fetchDashboard()
}, [])

  if (loading) return <p className="text-gray-400 p-6">Loading...</p>
  if (!stats) return null

  const chartData = [
    { name: 'Pending',   value: Number(stats.pending)   },
    { name: 'Approved',  value: Number(stats.approved)  },
    { name: 'Completed', value: Number(stats.completed) },
  ]

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-gray-500 text-sm">Here's what's happening with your orders</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Total Orders"   value={String(stats.total_orders)} />
        <StatCard title="Pending Orders" value={String(stats.pending)}      />
        <StatCard title="Completed"      value={String(stats.completed)}    />
        <StatCard title="Total Spent"    value={`$${Number(stats.total_spent ?? 0).toFixed(2)}`} />
      </div>

      {/* RECENT ORDERS */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Recent Orders</h2>
        </div>

        <div className="space-y-3">
          {orders.map(order => (
            <div key={order.order_id} className="flex justify-between items-center border-b pb-2">
              <div className="flex items-center gap-3">
                {order.image_url ? (
                  <img
                    src={order.image_url}
                    alt="vehicle"
                    className="w-12 h-12 rounded-md object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center text-xl">
                    🚗
                  </div>
                )}
                <div>
                  <p className="font-medium">#{String(order.order_id).padStart(4, '0')}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                    {' • '}{order.year} {order.brand} {order.model}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <StatusBadge status={order.status} />
                <p className="font-medium">${Number(order.total_price).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DONUT CHART */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="font-semibold mb-4">Order Status Overview</h2>
        <div className="flex items-center justify-between">
          <div className="w-1/2 h-52">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={chartData} innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {chartData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 text-sm">
            {chartData.map((item, i) => (
              <div key={i} className="flex justify-between gap-10">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  {item.name}
                </span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

export default BuyerDashboard

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
    pending:   'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }
  const labels = {
    pending: 'Pending', confirmed: 'Approved', completed: 'Completed', cancelled: 'Cancelled',
  }
  return (
    <span className={`px-2 py-1 rounded-full text-xs ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}