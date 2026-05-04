'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

interface VehicleDetail {
  vehicle_id: number
  brand: string
  model: string
  year: number
  mileage: number
  city: string
  color: string
  description: string
  condition: 'new' | 'used'
  vehicle_status: 'available' | 'sold'
  listing_id: number
  price: number
  listing_status: 'active' | 'sold' | 'inactive'
  created_at: string
  seller_name: string
  seller_phone: string | null
  seller_city: string | null
  seller_email: string
  images: string[]
}

function Skeleton({ w, h, rounded = '8px' }: { w: string; h: string; rounded?: string }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: rounded, flexShrink: 0,
      background: 'linear-gradient(90deg, #f0f2f5 25%, #e4e8ed 50%, #f0f2f5 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
    }} />
  )
}

const listingStatusStyle: Record<string, { bg: string; color: string }> = {
  active:   { bg: '#dcfce7', color: '#16a34a' },
  sold:     { bg: '#fee2e2', color: '#dc2626' },
  inactive: { bg: '#f3f4f6', color: '#6b7280' },
}

export default function VehicleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const [vehicle, setVehicle] = useState<VehicleDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeImage, setActiveImage] = useState(0)
  const [wishlisted, setWishlisted] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [ordering, setOrdering] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    const fetchVehicle = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/vehicles/${id}`)
        if (!res.ok) throw new Error('Vehicle not found')
        const data = await res.json()
        setVehicle(data)

        const wRes = await fetch('http://localhost:5000/users/my-wishlist', {
        credentials: 'include',
      })
      if (wRes.ok) {
        const wishlist = await wRes.json()
        const alreadyWishlisted = wishlist.some(
          (item: { listing_id: number }) => item.listing_id === data.listing_id
        )
        setWishlisted(alreadyWishlisted)
      }
      } catch (err: any) {
        setError(err.message || 'Failed to load vehicle')
      } finally {
        setLoading(false)
      }
    }
    fetchVehicle()
  }, [id])

  const handleOrder = async () => {
  if (!vehicle) return

  try {
    setOrdering(true)

    const res = await fetch('http://localhost:5000/users/orderVehicle', {
      method: 'POST',
      credentials: 'include', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        listingid: vehicle.listing_id, 
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Failed to place order')
    }

    setOrderPlaced(true)

    setVehicle(prev =>
      prev ? { ...prev, listing_status: 'sold' } : prev
    )

  } catch (err: any) {
    alert(err.message || 'Something went wrong')
  } finally {
    setOrdering(false)
  }
}

const handleWishlist = async () => {
  if (!vehicle) return;

  try {
    setWishlistLoading(true);
    
    const res = await fetch('http://localhost:5000/users/wishlist', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        listing_id: vehicle.listing_id, 
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Failed to update wishlist');
    }

    setWishlisted(!wishlisted);

  } catch (err: any) {
    alert(err.message || 'Something went wrong');
  } finally {
    setWishlistLoading(false);
  }
};

  const images = vehicle?.images?.length
    ? vehicle.images.map((img: string) => `http://localhost:5000/uploads/${img}`)
    : vehicle
    ? [`https://placehold.co/800x500/e8f0fe/2563eb?text=${encodeURIComponent(vehicle.brand + ' ' + vehicle.model)}`]
    : []

  const specs = vehicle
    ? [
        { label: 'Year',      value: String(vehicle.year),                                  icon: '📅' },
        { label: 'Mileage',   value: `${Number(vehicle.mileage).toLocaleString()} km`,      icon: '🛣️' },
        { label: 'Color',     value: vehicle.color,                                          icon: '🎨' },
        { label: 'Condition', value: vehicle.condition,                                      icon: '🏷️' },
        { label: 'City',      value: vehicle.city,                                           icon: '📍' },
        { label: 'Listed on', value: new Date(vehicle.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }), icon: '🗓️' },
      ]
    : []

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: '100vh', background: '#f8fafc' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        .spec-card:hover   { transform:translateY(-2px); box-shadow:0 4px 16px rgba(37,99,235,0.10) !important; }
        .thumb:hover       { border-color:#2563eb !important; }
        .back-btn:hover    { background:#e8f0fe !important; color:#2563eb !important; }
        .contact-btn:hover { background:#1d4ed8 !important; }
        .order-btn:hover   { opacity:0.88 !important; }
        .wishlist-btn:hover{ background:#fff0f0 !important; }
      `}</style>

      {/* Top bar */}
      <div style={{
        background: '#fff', borderBottom: '1px solid #f0f2f5',
        padding: '0 32px', height: '60px',
        display: 'flex', alignItems: 'center', gap: '16px',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <button className="back-btn" onClick={() => router.back()} style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: '#555', fontSize: '14px', fontFamily: "'DM Sans', sans-serif",
          fontWeight: '500', padding: '6px 12px', borderRadius: '8px', transition: 'all 0.15s',
        }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back
        </button>
        <span style={{ color: '#ddd' }}>|</span>
        <span style={{ fontSize: '13px', color: '#999' }}>
          Browse Vehicles &rsaquo;&nbsp;
          <span style={{ color: '#2563eb', fontWeight: '600' }}>
            {vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Loading…'}
          </span>
        </span>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px', animation: 'fadeUp 0.4s ease' }}>

        {/* Error state */}
        {error && (
          <div style={{
            background: '#fff5f5', border: '1px solid #fecaca', borderRadius: '12px',
            padding: '40px', textAlign: 'center', color: '#dc2626',
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🚗</div>
            <div style={{ fontWeight: '700', fontSize: '18px' }}>{error}</div>
            <div style={{ fontSize: '14px', color: '#ef4444', marginTop: '6px' }}>
              Check the listing ID or try again later.
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && !error && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Skeleton w="100%" h="420px" rounded="16px" />
              <div style={{ display: 'flex', gap: '10px' }}>
                {[1,2,3].map(i => <Skeleton key={i} w="90px" h="64px" rounded="10px" />)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[1,2,3,4,5,6].map(i => <Skeleton key={i} w="100%" h="68px" rounded="12px" />)}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <Skeleton w="85%" h="32px" />
              <Skeleton w="45%" h="22px" />
              <Skeleton w="100%" h="110px" />
              <Skeleton w="100%" h="50px" />
              <Skeleton w="100%" h="50px" />
            </div>
          </div>
        )}

        {/* Main content */}
        {vehicle && !error && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px', alignItems: 'start' }}>

            {/* LEFT */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Main image */}
              <div style={{
                borderRadius: '16px', overflow: 'hidden',
                background: '#e8f0fe', position: 'relative',
                aspectRatio: '16/10', boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
              }}>
                <img
                  key={activeImage}
                  src={images[activeImage]}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', animation: 'fadeIn 0.2s ease' }}
                />

                {/* Listing status badge */}
                <span style={{
                  position: 'absolute', top: '14px', left: '14px',
                  background: listingStatusStyle[vehicle.listing_status]?.bg || '#f3f4f6',
                  color: listingStatusStyle[vehicle.listing_status]?.color || '#555',
                  fontSize: '12px', fontWeight: '700',
                  padding: '4px 12px', borderRadius: '20px',
                  textTransform: 'capitalize', letterSpacing: '0.03em',
                }}>
                  {vehicle.listing_status}
                </span>

                {/* Condition badge */}
                <span style={{
                  position: 'absolute', top: '14px', right: '14px',
                  background: vehicle.condition === 'new' ? '#dbeafe' : '#f3f4f6',
                  color: vehicle.condition === 'new' ? '#2563eb' : '#6b7280',
                  fontSize: '12px', fontWeight: '700',
                  padding: '4px 12px', borderRadius: '20px',
                  textTransform: 'capitalize',
                }}>
                  {vehicle.condition}
                </span>

                {/* Prev/Next arrows */}
                {images.length > 1 && (
                  <>
                    <button onClick={() => setActiveImage(i => (i - 1 + images.length) % images.length)} style={{
                      position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                      background: 'rgba(255,255,255,0.92)', border: 'none', borderRadius: '50%',
                      width: '36px', height: '36px', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                    }}>
                      <svg width="16" height="16" fill="none" stroke="#333" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>
                    <button onClick={() => setActiveImage(i => (i + 1) % images.length)} style={{
                      position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                      background: 'rgba(255,255,255,0.92)', border: 'none', borderRadius: '50%',
                      width: '36px', height: '36px', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                    }}>
                      <svg width="16" height="16" fill="none" stroke="#333" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {images.map((src, i) => (
                    <button key={i} className="thumb" onClick={() => setActiveImage(i)} style={{
                      flexShrink: 0, width: '90px', height: '64px', borderRadius: '10px',
                      overflow: 'hidden', padding: 0, background: 'transparent', cursor: 'pointer',
                      border: `2px solid ${i === activeImage ? '#2563eb' : '#e8ecf0'}`,
                      transition: 'border-color 0.15s',
                    }}>
                      <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}

              {/* Specs grid */}
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#111', margin: '0 0 14px' }}>
                  Vehicle Specifications
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {specs.map(spec => (
                    <div key={spec.label} className="spec-card" style={{
                      background: '#fff', border: '1px solid #f0f2f5', borderRadius: '12px',
                      padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px',
                      transition: 'all 0.18s ease', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    }}>
                      <span style={{ fontSize: '20px' }}>{spec.icon}</span>
                      <div>
                        <div style={{ fontSize: '11px', color: '#aaa', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          {spec.label}
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#111', marginTop: '2px', textTransform: 'capitalize' }}>
                          {spec.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              {vehicle.description && (
                <div style={{ background: '#fff', border: '1px solid #f0f2f5', borderRadius: '14px', padding: '20px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#111', margin: '0 0 10px' }}>
                    About this Vehicle
                  </h2>
                  <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.8', margin: 0 }}>
                    {vehicle.description}
                  </p>
                </div>
              )}
            </div>

            {/* RIGHT — sticky price card */}
            <div style={{ position: 'sticky', top: '76px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                background: '#fff', border: '1px solid #f0f2f5',
                borderRadius: '16px', padding: '24px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
              }}>
                {/* Title */}
                <h1 style={{
                  fontSize: '22px', fontWeight: '700', color: '#111',
                  margin: '0 0 4px', fontFamily: "'DM Serif Display', serif", lineHeight: '1.25',
                }}>
                  {vehicle.year} {vehicle.brand} {vehicle.model}
                </h1>
                <div style={{ fontSize: '13px', color: '#aaa', marginBottom: '20px' }}>
                  Listing #{vehicle.listing_id}
                </div>

                {/* Price */}
                <div style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  borderRadius: '12px', padding: '18px 20px', marginBottom: '20px',
                }}>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Asking Price
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#fff', marginTop: '4px', fontFamily: "'DM Serif Display', serif" }}>
                    PKR {Number(vehicle.price).toLocaleString()}
                  </div>
                </div>

                {/* Quick stats */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                  {[
                    { label: 'Year',      value: vehicle.year },
                    { label: 'km',        value: `${Math.round(Number(vehicle.mileage) / 1000)}k` },
                    { label: 'Condition', value: vehicle.condition === 'new' ? 'New' : 'Used' },
                  ].map(s => (
                    <div key={s.label} style={{
                      flex: 1, textAlign: 'center', background: '#f8fafc',
                      borderRadius: '10px', padding: '10px 6px',
                    }}>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#111' }}>{s.value}</div>
                      <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Contact Seller */}
                <button
                  className="contact-btn"
                  onClick={() => setContactOpen(o => !o)}
                  style={{
                    width: '100%', padding: '14px',
                    background: '#2563eb', color: '#fff',
                    border: 'none', borderRadius: '12px',
                    fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: '700',
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: '8px',
                    transition: 'background 0.15s', marginBottom: '10px',
                  }}
                >
                  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2A19.86 19.86 0 013.09 4.18 2 2 0 015.07 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                  {contactOpen ? 'Hide Contact' : 'Contact Seller'}
                </button>

                {/* Order Vehicle */}
                <button
                  className="order-btn"
                  disabled={vehicle.listing_status !== 'active'}
                  onClick={()=>{
                    alert("Order has been Placed!");
                    handleOrder();
                  }}
                  style={{
                    width: '100%', padding: '14px',
                    background: vehicle.listing_status === 'active'
                      ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)'
                      : '#e5e7eb',
                    color: vehicle.listing_status === 'active' ? '#fff' : '#9ca3af',
                    border: 'none', borderRadius: '12px',
                    fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: '700',
                    cursor: vehicle.listing_status === 'active' ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: '8px',
                    transition: 'opacity 0.15s', marginBottom: '10px',
                  }}
                >
                  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 01-8 0"/>
                  </svg>
                  {vehicle.listing_status === 'active' ? 'Order Vehicle' : 'Not Available'}
                </button>

                {/* Wishlist */}
                <button
                  className="wishlist-btn"
                  disabled={wishlistLoading}
                  onClick={handleWishlist}
                  style={{
                    width: '100%', padding: '13px',
                    background: wishlisted ? '#fff0f0' : '#f8fafc',
                    color: wishlisted ? '#ef4444' : '#555',
                    border: `1px solid ${wishlisted ? '#fecaca' : '#e8ecf0'}`,
                    borderRadius: '12px', fontFamily: "'DM Sans', sans-serif",
                    fontSize: '15px', fontWeight: '600', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    transition: 'all 0.15s',
                  }}
                >
                  <svg width="17" height="17"
                    fill={wishlisted ? '#ef4444' : 'none'}
                    stroke={wishlisted ? '#ef4444' : 'currentColor'}
                    strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                  </svg>
                  {wishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                </button>

                {/* Seller info reveal */}
                {contactOpen && (
                  <div style={{
                    marginTop: '14px', padding: '16px',
                    background: '#f0f7ff', border: '1px solid #dbeafe',
                    borderRadius: '12px', animation: 'fadeUp 0.2s ease',
                  }}>
                    <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                      Seller Info
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <div style={{
                        width: '40px', height: '40px', background: '#2563eb', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                        </svg>
                      </div>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#111' }}>
                          {vehicle.seller_name}
                        </div>
                        {vehicle.seller_city && (
                          <div style={{ fontSize: '12px', color: '#888', marginTop: '1px' }}>
                            📍 {vehicle.seller_city}
                          </div>
                        )}
                      </div>
                    </div>

                    {vehicle.seller_phone && (
                      <a href={`tel:${vehicle.seller_phone}`} style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        background: '#fff', border: '1px solid #dbeafe', borderRadius: '10px',
                        padding: '10px 14px', color: '#2563eb', textDecoration: 'none',
                        fontSize: '14px', fontWeight: '600', marginBottom: '8px',
                      }}>
                        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                          <path d="M22 16.92v3a2 2 0 01-2.18 2A19.86 19.86 0 013.09 4.18 2 2 0 015.07 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                        </svg>
                        {vehicle.seller_phone}
                      </a>
                    )}

                    <a href={`mailto:${vehicle.seller_email}`} style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      background: '#fff', border: '1px solid #dbeafe', borderRadius: '10px',
                      padding: '10px 14px', color: '#2563eb', textDecoration: 'none',
                      fontSize: '14px', fontWeight: '600',
                    }}>
                      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                      </svg>
                      {vehicle.seller_email}
                    </a>
                  </div>
                )}
              </div>

              {/* Safety tip */}
              <div style={{
                background: '#fffbeb', border: '1px solid #fde68a',
                borderRadius: '12px', padding: '14px 16px',
                display: 'flex', gap: '10px', alignItems: 'flex-start',
              }}>
                <span style={{ fontSize: '18px', flexShrink: 0 }}>⚠️</span>
                <div style={{ fontSize: '12px', color: '#92400e', lineHeight: '1.7' }}>
                  <strong>Safety tip:</strong> Always inspect the vehicle in person before making any payment. Avoid wire transfers to unknown parties.
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}