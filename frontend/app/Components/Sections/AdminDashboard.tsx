'use client'
import { useEffect, useState } from 'react'

interface Stats {
    total_users: number
    active_users: number
    total_listings: number
    active_listings: number
    total_orders: number
    total_revenue: number
}

const statConfig = [
    {
        key: 'total_users',
        label: 'Total Users',
        badge: '+12%',
        badgeColor: '#16a34a',
        badgeBg: '#dcfce7',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
        iconBg: '#eff6ff',
    },
    {
        key: 'active_users',
        label: 'Active Users',
        badge: '+8%',
        badgeColor: '#16a34a',
        badgeBg: '#dcfce7',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
        ),
        iconBg: '#f0fdf4',
    },
    {
        key: 'total_listings',
        label: 'Total Listings',
        badge: null,
        badgeColor: '',
        badgeBg: '',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
        ),
        iconBg: '#fff7ed',
    },
    {
        key: 'active_listings',
        label: 'Active Listings',
        badge: '--',
        badgeColor: '#6b7280',
        badgeBg: '#f3f4f6',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
        ),
        iconBg: '#fff7ed',
    },
    {
        key: 'total_orders',
        label: 'Total Orders',
        badge: '+5%',
        badgeColor: '#16a34a',
        badgeBg: '#dcfce7',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
        ),
        iconBg: '#f5f3ff',
    },
    {
        key: 'total_revenue',
        label: 'Total Revenue',
        badge: '+23%',
        badgeColor: '#16a34a',
        badgeBg: '#dcfce7',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
        ),
        iconBg: '#f0fdf4',
        isRevenue: true,
    },
]

// FIX: Added null/undefined guard so .toString() is never called on undefined
function formatValue(key: string, value: number, isRevenue?: boolean) {
    if (value === undefined || value === null) return '—'
    if (isRevenue) {
        if (value >= 1000000) return `PKR ${(value / 1000000).toFixed(1)}M`
        if (value >= 1000) return `PKR ${(value / 1000).toFixed(0)}K`
        return `PKR ${value.toLocaleString()}`
    }
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
    return value.toString()
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null)

    useEffect(() => {
        fetch('http://localhost:5000/users/stats', { credentials: 'include' })
            .then(r => r.json())
            .then(data => {
                console.log('Stats from API:', data) // helpful for debugging missing fields
                setStats(data)
            })
            .catch(err => console.error('Failed to fetch stats:', err))
    }, [])

    return (
        <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: '#111827' }}>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '26px', fontWeight: 700, margin: 0, color: '#111827' }}>
                    System Overview
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#6b7280' }}>
                    Welcome back! Here's what's happening with your platform.
                </p>
            </div>

            {/* Stats Grid */}
            {!stats ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    {[...Array(6)].map((_, i) => (
                        <div key={i} style={{
                            background: '#fff', borderRadius: '14px', padding: '24px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9',
                            animation: 'pulse 1.5s ease-in-out infinite',
                        }}>
                            <div style={{ height: '12px', background: '#f1f5f9', borderRadius: '6px', width: '60%', marginBottom: '12px' }} />
                            <div style={{ height: '32px', background: '#f1f5f9', borderRadius: '6px', width: '40%' }} />
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    {statConfig.map(cfg => {
                        // FIX: Default to 0 if the field is missing from the API response
                        const rawValue = (stats[cfg.key as keyof Stats] ?? 0) as number
                        const displayValue = formatValue(cfg.key, rawValue, cfg.isRevenue)

                        return (
                            <div key={cfg.key} style={{
                                background: '#fff',
                                borderRadius: '14px',
                                padding: '22px 24px',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                                border: '1px solid #f1f5f9',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '14px',
                                transition: 'box-shadow 0.2s',
                            }}
                                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)')}
                                onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)')}
                            >
                                {/* Top row: icon + badge */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: '44px', height: '44px', borderRadius: '10px',
                                        background: cfg.iconBg, display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        {cfg.icon}
                                    </div>
                                    {cfg.badge && (
                                        <span style={{
                                            fontSize: '12px', fontWeight: 600,
                                            color: cfg.badgeColor, background: cfg.badgeBg,
                                            padding: '3px 9px', borderRadius: '20px',
                                        }}>
                                            {cfg.badge}
                                        </span>
                                    )}
                                </div>

                                {/* Label + Value */}
                                <div>
                                    <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>
                                        {cfg.label}
                                    </p>
                                    <p style={{ margin: '4px 0 0', fontSize: '28px', fontWeight: 700, color: '#111827', letterSpacing: '-0.5px' }}>
                                        {displayValue}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </div>
    )
}