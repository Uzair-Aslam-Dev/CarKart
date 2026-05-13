'use client'
import { useEffect, useState } from 'react'

interface Order {
    order_id: number
    buyer_name: string
    seller_name: string
    brand: string
    model: string
    year: number
    total_price: number
    status: string
    created_at: string
}

const statusStyle: Record<string, { color: string; bg: string }> = {
    pending:   { color: '#d97706', bg: '#fef3c7' },
    confirmed: { color: '#2563eb', bg: '#dbeafe' },
    completed: { color: '#16a34a', bg: '#dcfce7' },
    cancelled: { color: '#dc2626', bg: '#fee2e2' },
}

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([])
    const [search, setSearch] = useState('')

    useEffect(() => {
        fetch('http://localhost:5000/users/adminorders', { credentials: 'include' })
            .then(r => r.json())
            .then(data => setOrders(data.orders))
    }, [])

    const filtered = orders.filter(o =>
        `${o.brand} ${o.model} ${o.buyer_name} ${o.seller_name} ${o.order_id}`
            .toLowerCase()
            .includes(search.toLowerCase())
    )

    return (
        <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: '#111827' }}>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '26px', fontWeight: 700, margin: 0 }}>All Orders</h2>
                <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#6b7280' }}>
                    Track and review all transactions across the platform.
                </p>
            </div>

            {/* Table Card */}
            <div style={{
                background: '#fff',
                borderRadius: '14px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                overflow: 'hidden',
            }}>
                {/* Toolbar */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 20px',
                    borderBottom: '1px solid #f1f5f9',
                }}>
                    <p style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Order History</p>
                    <div style={{ position: 'relative' }}>
                        <svg style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}
                            width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{
                                paddingLeft: '32px', paddingRight: '12px',
                                paddingTop: '8px', paddingBottom: '8px',
                                fontSize: '13px', borderRadius: '8px',
                                border: '1px solid #e5e7eb', outline: 'none',
                                width: '220px', color: '#111827',
                                background: '#f9fafb',
                            }}
                        />
                    </div>
                </div>

                {/* Table */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
                        <thead>
                            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                {['Order ID', 'Vehicle', 'Buyer', 'Seller', 'Price', 'Status', 'Date'].map(h => (
                                    <th key={h} style={{
                                        padding: '11px 16px', textAlign: 'left',
                                        fontSize: '11px', fontWeight: 600,
                                        color: '#6b7280', textTransform: 'uppercase',
                                        letterSpacing: '0.05em', whiteSpace: 'nowrap',
                                    }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
                                        No orders found.
                                    </td>
                                </tr>
                            ) : filtered.map((o, i) => {
                                const s = statusStyle[o.status] ?? { color: '#6b7280', bg: '#f3f4f6' }
                                return (
                                    <tr key={o.order_id}
                                        style={{
                                            borderBottom: i < filtered.length - 1 ? '1px solid #f1f5f9' : 'none',
                                            transition: 'background 0.12s',
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                    >
                                        {/* Order ID */}
                                        <td style={{ padding: '13px 16px' }}>
                                            <span style={{ fontWeight: 600, color: '#2563eb' }}>#{o.order_id}</span>
                                        </td>

                                        {/* Vehicle */}
                                        <td style={{ padding: '13px 16px', fontWeight: 600, color: '#111827' }}>
                                            {o.brand} {o.model}
                                            <span style={{ fontWeight: 400, color: '#6b7280', marginLeft: '4px' }}>({o.year})</span>
                                        </td>

                                        {/* Buyer */}
                                        <td style={{ padding: '13px 16px', color: '#374151' }}>{o.buyer_name}</td>

                                        {/* Seller */}
                                        <td style={{ padding: '13px 16px', color: '#374151' }}>{o.seller_name}</td>

                                        {/* Price */}
                                        <td style={{ padding: '13px 16px', fontWeight: 600, color: '#111827', whiteSpace: 'nowrap' }}>
                                            PKR {Number(o.total_price).toLocaleString()}
                                        </td>

                                        {/* Status */}
                                        <td style={{ padding: '13px 16px' }}>
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '3px 10px', borderRadius: '20px',
                                                fontSize: '12px', fontWeight: 600,
                                                color: s.color, background: s.bg,
                                                textTransform: 'capitalize',
                                            }}>
                                                {o.status}
                                            </span>
                                        </td>

                                        {/* Date */}
                                        <td style={{ padding: '13px 16px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                                            {new Date(o.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                {filtered.length > 0 && (
                    <div style={{
                        padding: '12px 20px',
                        borderTop: '1px solid #f1f5f9',
                        fontSize: '13px', color: '#6b7280',
                    }}>
                        Showing {filtered.length} of {orders.length} orders
                    </div>
                )}
            </div>
        </div>
    )
}