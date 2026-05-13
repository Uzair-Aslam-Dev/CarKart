'use client'

import { LayoutDashboard, Users, Car, ShoppingBag } from 'lucide-react'

type AdminView = 'Dashboard' | 'Users' | 'Listings' | 'Orders'

const navItems: { view: AdminView; icon: React.ReactNode }[] = [
    {
        view: 'Dashboard',
        icon: <LayoutDashboard size={18} />,
    },
    {
        view: 'Users',
        icon: <Users size={18} />,
    },
    {
        view: 'Listings',
        icon: <Car size={18} />,
    },
    {
        view: 'Orders',
        icon: <ShoppingBag size={18} />,
    },
]

export default function AdminNav({
    setView,
    currentView,
}: {
    setView: (v: AdminView) => void
    currentView: AdminView
}) {
    return (
        <div style={{
            width: '240px',
            minHeight: '100vh',
            background: '#ffffff',
            borderRight: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px 12px',
            fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        }}>
            {/* Brand */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '4px 12px 20px',
                borderBottom: '1px solid #f1f5f9',
                marginBottom: '16px',
            }}>
                <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: '#2563eb', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                    <Car size={18} color="#fff" />
                </div>
                <div>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#111827' }}>
                        CarKart
                    </p>
                    <p style={{ margin: 0, fontSize: '11px', color: '#6b7280' }}>
                        Admin Panel
                    </p>
                </div>
            </div>

            {/* Nav Items */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                {navItems.map(({ view, icon }) => {
                    const isActive = currentView === view
                    return (
                        <button
                            key={view}
                            onClick={() => setView(view)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                textAlign: 'left',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: isActive ? 600 : 500,
                                color: isActive ? '#2563eb' : '#4b5563',
                                background: isActive ? '#eff6ff' : 'transparent',
                                transition: 'all 0.15s ease',
                                width: '100%',
                            }}
                            onMouseEnter={e => {
                                if (!isActive) {
                                    e.currentTarget.style.background = '#f9fafb'
                                    e.currentTarget.style.color = '#111827'
                                }
                            }}
                            onMouseLeave={e => {
                                if (!isActive) {
                                    e.currentTarget.style.background = 'transparent'
                                    e.currentTarget.style.color = '#4b5563'
                                }
                            }}
                        >
                            <span style={{ color: isActive ? '#2563eb' : '#9ca3af' }}>
                                {icon}
                            </span>
                            {view}
                        </button>
                    )
                })}
            </nav>
        </div>
    )
}