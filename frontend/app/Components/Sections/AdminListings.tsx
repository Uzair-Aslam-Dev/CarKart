'use client'
import { useEffect, useState } from 'react'

interface Listing {
    listing_id: number
    brand: string
    model: string
    year: number
    city: string
    price: number
    status: string
    seller_name: string
    condition: string
    created_at: string
    image_url: string
}

const statusStyle: Record<string, { color: string; bg: string }> = {
    active:   { color: '#16a34a', bg: '#dcfce7' },
    sold:     { color: '#2563eb', bg: '#dbeafe' },
    inactive: { color: '#dc2626', bg: '#fee2e2' },
    pending:  { color: '#d97706', bg: '#fef3c7' },
}

export default function AdminListings() {
    const [listings, setListings] = useState<Listing[]>([])
    const [search, setSearch] = useState('')

    const fetchListings = () => {
        fetch('http://localhost:5000/users/listings', { credentials: 'include' })
            .then(r => r.json())
            .then(data => setListings(data.listings))
    }

    useEffect(() => { fetchListings() }, [])

    const toggleListing = async (id: number) => {
        await fetch(`http://localhost:5000/admin/listings/${id}/toggle`, {
            method: 'PUT',
            credentials: 'include',
        })
        fetchListings()
    }

    const filtered = listings.filter(l =>
        `${l.brand} ${l.model} ${l.seller_name} ${l.city}`.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: '#111827' }}>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '26px', fontWeight: 700, margin: 0 }}>All Listings</h2>
                <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#6b7280' }}>
                    Manage and monitor all vehicle listings on the platform.
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
                    <p style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>
                        Vehicle Listings
                    </p>
                    {/* Search */}
                    <div style={{ position: 'relative' }}>
                        <svg style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}
                            width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search listings..."
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
                                {['Vehicle', 'Seller', 'City', 'Price', 'Condition', 'Status', 'Listed', 'Actions'].map(h => (
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
                                    <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
                                        No listings found.
                                    </td>
                                </tr>
                            ) : filtered.map((l, i) => {
                                const s = statusStyle[l.status] ?? { color: '#6b7280', bg: '#f3f4f6' }
                                return (
                                    <tr key={l.listing_id}
                                        style={{
                                            borderBottom: i < filtered.length - 1 ? '1px solid #f1f5f9' : 'none',
                                            transition: 'background 0.12s',
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                    >
                                        {/* Vehicle */}
                                        <td style={{ padding: '13px 16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                {l.image_url ? (
                                                    <img src={
                                                        l.image_url
                                                        ? `http://localhost:5000/uploads/${l.image_url}`
                                                        : ''
                                                    } alt=""
                                                        style={{ width: '44px', height: '36px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0, background: '#f1f5f9' }} />
                                                ) : (
                                                    <div style={{
                                                        width: '44px', height: '36px', borderRadius: '6px',
                                                        background: '#f1f5f9', flexShrink: 0,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    }}>
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                                                            <rect x="2" y="7" width="20" height="10" rx="2"/><path d="M6 7V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2"/>
                                                        </svg>
                                                    </div>
                                                )}
                                                <span style={{ fontWeight: 600, color: '#111827' }}>
                                                    {l.brand} {l.model}
                                                    <span style={{ fontWeight: 400, color: '#6b7280', marginLeft: '4px' }}>({l.year})</span>
                                                </span>
                                            </div>
                                        </td>

                                        {/* Seller */}
                                        <td style={{ padding: '13px 16px', color: '#374151' }}>{l.seller_name}</td>

                                        {/* City */}
                                        <td style={{ padding: '13px 16px', color: '#374151' }}>{l.city}</td>

                                        {/* Price */}
                                        <td style={{ padding: '13px 16px', fontWeight: 600, color: '#111827', whiteSpace: 'nowrap' }}>
                                            PKR {Number(l.price).toLocaleString()}
                                        </td>

                                        {/* Condition */}
                                        <td style={{ padding: '13px 16px', color: '#374151', textTransform: 'capitalize' }}>
                                            {l.condition}
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
                                                {l.status}
                                            </span>
                                        </td>

                                        {/* Date */}
                                        <td style={{ padding: '13px 16px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                                            {new Date(l.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>

                                        {/* Actions */}
                                        <td style={{ padding: '13px 16px' }}>
                                            {l.status !== 'sold' && (
                                                <button
                                                    onClick={() => toggleListing(l.listing_id)}
                                                    style={{
                                                        padding: '5px 12px', borderRadius: '6px',
                                                        fontSize: '12px', fontWeight: 600,
                                                        border: 'none', cursor: 'pointer',
                                                        color: l.status === 'inactive' ? '#16a34a' : '#dc2626',
                                                        background: l.status === 'inactive' ? '#dcfce7' : '#fee2e2',
                                                        transition: 'opacity 0.15s',
                                                    }}
                                                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
                                                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                                                >
                                                    {l.status === 'inactive' ? 'Reactivate' : 'Deactivate'}
                                                </button>
                                            )}
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
                        padding: '12px 20px', borderTop: '1px solid #f1f5f9',
                        fontSize: '13px', color: '#6b7280',
                    }}>
                        Showing {filtered.length} of {listings.length} listings
                    </div>
                )}
            </div>
        </div>
    )
}