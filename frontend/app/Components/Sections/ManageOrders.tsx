'use client'

import React, { useState, useEffect, useCallback } from 'react'

type OrderStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

interface SellerOrderRow {
  order_id: number
  buyer_id: number
  listing_id: number
  total_price: string | number
  status: OrderStatus
  created_at: string
  brand: string
  model: string
  year?: number | null
  buyer_name: string
  buyer_phone: string | null
  buyer_email: string | null
}

const BADGE_STYLES: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending approval',
  confirmed: 'Approved',
  completed: 'Completed',
  cancelled: 'Rejected',
}

const API_LIST = 'http://localhost:5000/users/seller-orders'

function ManageOrders() {
  const [orders, setOrders] = useState<SellerOrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState<number | null>(null)

  const fetchOrders = useCallback(async () => {
    try {
      setError('')
      const res = await fetch(API_LIST, { credentials: 'include' })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.message ?? 'Could not load orders.')
        setOrders([])
        return
      }
      setOrders(data.orders ?? [])
    } catch {
      setError('Network error. Please try again.')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const patchOrder = async (order_id: number, action: 'approve' | 'reject' | 'complete') => {
    try {
      setBusyId(order_id)
      const res = await fetch(
        `http://localhost:5000/users/seller-orders/${order_id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ action }),
        }
      )
      const data = await res.json()
      if (!res.ok) {
        alert(data?.message ?? 'Update failed.')
        return
      }
      await fetchOrders()
    } catch {
      alert('Network error.')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Manage orders</h1>
        <p className="text-gray-500 text-sm">
          Approve or reject purchase requests for your listings. Rejecting a pending order
          returns the listing to active so other buyers can order.
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-gray-500 text-left bg-gray-50">
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Vehicle</th>
              <th className="px-4 py-3 font-medium">Buyer</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
        </table>

        <div className="overflow-y-auto max-h-[60vh]">
          <table className="w-full text-sm">
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400">
                    Loading orders…
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400">
                    No orders for your listings yet.
                  </td>
                </tr>
              ) : (
                orders.map((o) => {
                  const busy = busyId === o.order_id
                  return (
                    <tr
                      key={o.order_id}
                      className="border-b last:border-0 hover:bg-gray-50 align-top"
                    >
                      <td className="px-4 py-3 font-medium">
                        #{String(o.order_id).padStart(4, '0')}
                      </td>
                      <td className="px-4 py-3 text-gray-800">
                        <div className="font-medium">{o.brand} {o.model}</div>
                        {o.year != null && (
                          <div className="text-xs text-gray-500">{o.year}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        <div>{o.buyer_name}</div>
                        {o.buyer_phone && (
                          <div className="text-xs text-gray-500">{o.buyer_phone}</div>
                        )}
                        {o.buyer_email && (
                          <div className="text-xs text-gray-500 truncate max-w-[200px]">{o.buyer_email}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium whitespace-nowrap">
                        Rs {Number(o.total_price).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {new Date(o.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${BADGE_STYLES[o.status]}`}
                        >
                          {STATUS_LABELS[o.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {o.status === 'pending' && (
                          <div className="flex flex-wrap gap-1">
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => patchOrder(o.order_id, 'approve')}
                              className="text-xs px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => patchOrder(o.order_id, 'reject')}
                              className="text-xs px-2 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {o.status === 'confirmed' && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => patchOrder(o.order_id, 'complete')}
                            className="text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                          >
                            Mark complete
                          </button>
                        )}
                        {(o.status === 'completed' || o.status === 'cancelled') && (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ManageOrders
