import React, { useState } from 'react'

function BuyerNav({setView}:any) {
  const [active, setActive] = useState('Browse Vehicles')

  const mainNav = [
    {
      name: 'Browse Vehicles',
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="3" y="11" width="18" height="5"/>
        <circle cx="7" cy="18" r="2"/>
        <circle cx="17" cy="18" r="2"/>
        </svg>
      )
    },
    { name: 'Dashboard', icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    )},
    { name: 'My Orders', icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/>
      </svg>
    ), badge: 1 },
    { name: 'Wishlist', icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    )},
  ]

  const accountNav = [
    { name: 'Profile Settings', icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    )},
    { name: 'Notifications', icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
      </svg>
    )},
    { name: 'Security', icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    )},
    { name: 'Logout', icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
    ), danger: true },
  ]

  return (
    <div style={{
      width: '210px',
      minHeight: '100vh',
      background: '#fff',
      borderRight: '1px solid #f0f0f0',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'DM Sans', sans-serif",
      padding: '0',
    }}>
      {/* Logo */}
      <div style={{
        padding: '20px 20px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <div style={{
          width: '36px', height: '36px',
          background: '#2563eb',
          borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6" stroke="white" strokeWidth="2"/><path d="M16 10a4 4 0 01-8 0" stroke="white" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        <span style={{ fontWeight: '700', fontSize: '17px', color: '#111', letterSpacing: '-0.3px' }}>BuyerHub</span>
      </div>

      {/* Main nav */}
      <nav style={{ padding: '0 12px', flex: 1 }}>
        {mainNav.map(item => {
          const isActive = active === item.name
          return (
            <button
              key={item.name}
              onClick={() => {
                setActive(item.name)
                setView(item.name)
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                marginBottom: '2px',
                background: isActive ? '#2563eb' : 'transparent',
                color: isActive ? '#fff' : '#555',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '14px',
                fontWeight: isActive ? '600' : '400',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#f5f7ff' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
            >
              <span style={{ opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.name}</span>
              {item.badge && (
                <span style={{
                  background: isActive ? 'rgba(255,255,255,0.25)' : '#e8f0fe',
                  color: isActive ? '#fff' : '#2563eb',
                  fontSize: '11px',
                  fontWeight: '700',
                  borderRadius: '20px',
                  padding: '1px 7px',
                  minWidth: '22px',
                  textAlign: 'center',
                }}>{item.badge}</span>
              )}
            </button>
          )
        })}

        {/* Account section */}
        <div style={{
          fontSize: '11px',
          fontWeight: '600',
          color: '#aaa',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          padding: '20px 12px 8px',
        }}>Account</div>

        {accountNav.map(item => {
          const isActive = active === item.name
          return (
            <button
              key={item.name}
              onClick={() => setActive(item.name)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                marginBottom: '2px',
                background: isActive ? '#2563eb' : 'transparent',
                color: item.danger ? '#ef4444' : isActive ? '#fff' : '#555',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '14px',
                fontWeight: isActive ? '600' : '400',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = item.danger ? '#fff5f5' : '#f5f7ff' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
            >
              <span style={{ opacity: isActive ? 1 : item.danger ? 1 : 0.6 }}>{item.icon}</span>
              <span>{item.name}</span>
            </button>
          )
        })}
      </nav>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
    </div>
  )
}

export default BuyerNav