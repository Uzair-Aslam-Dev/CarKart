'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface WishlistItem {
  wishlist_id: number
  listing_id: number
  vehicle_id: number
  brand: string
  model: string
  year: number
  price: number
  city: string
  image_url: string | null
}

function SkeletonCard() {
  return (
    <div style={{
      background: '#fff', borderRadius: '18px', overflow: 'hidden',
      border: '1px solid #f0f2f5',
    }}>
      <div style={{
        height: '190px',
        background: 'linear-gradient(90deg, #f0f2f5 25%, #e4e8ed 50%, #f0f2f5 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.4s infinite',
      }} />
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ height: '12px', width: '40%', borderRadius: '6px', background: 'linear-gradient(90deg, #f0f2f5 25%, #e4e8ed 50%, #f0f2f5 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
        <div style={{ height: '18px', width: '70%', borderRadius: '6px', background: 'linear-gradient(90deg, #f0f2f5 25%, #e4e8ed 50%, #f0f2f5 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
        <div style={{ height: '14px', width: '55%', borderRadius: '6px', background: 'linear-gradient(90deg, #f0f2f5 25%, #e4e8ed 50%, #f0f2f5 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
      </div>
    </div>
  )
}

export default function BuyerWishlist() {
  const router = useRouter()
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState<number | null>(null)

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch('http://localhost:5000/users/my-wishlist', {
          credentials: 'include',
        })
        if (res.ok) {
          const data = await res.json()
          setItems(data)
        }
      } catch (err) {
        console.error('Failed to load wishlist', err)
      } finally {
        setLoading(false)
      }
    }
    fetchWishlist()
  }, [])

  const removeItem = async (e: React.MouseEvent, listingId: number) => {
    e.stopPropagation()
    setRemoving(listingId)
    try {
      const res = await fetch('http://localhost:5000/users/wishlist', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: listingId }),
      })
      if (res.ok) {
        setItems(prev => prev.filter(item => item.listing_id !== listingId))
      }
    } catch (err) {
      alert('Failed to remove item')
    } finally {
      setRemoving(null)
    }
  }

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      minHeight: '100vh',
      background: '#f8fafc',
      padding: '40px 20px',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Serif+Display&display=swap');
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes popIn  { from{opacity:0;transform:scale(0.85)} to{opacity:1;transform:scale(1)} }

        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }

        .wish-card {
          background: #fff;
          border-radius: 18px;
          overflow: visible;
          border: 1px solid #f0f2f5;
          transition: transform 0.22s ease, box-shadow 0.22s ease;
          cursor: pointer;
          position: relative;
          animation: fadeUp 0.35s ease both;
        }
        .wish-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 40px rgba(37,99,235,0.10);
          border-color: #dbeafe;
        }

        .card-image-wrap {
          height: 190px;
          border-radius: 14px 14px 0 0;
          overflow: hidden;
          position: relative;
        }
        .card-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .wish-card:hover .card-image-wrap img {
          transform: scale(1.04);
        }

        .remove-btn {
          position: absolute;
          top: -10px;
          right: -10px;
          background: #fff;
          border: 1.5px solid #fecaca;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #ef4444;
          transition: all 0.18s ease;
          z-index: 20;
          box-shadow: 0 2px 8px rgba(0,0,0,0.10);
          padding: 0;
          flex-shrink: 0;
        }
        .remove-btn:hover {
          background: #ef4444;
          border-color: #ef4444;
          color: #fff;
          transform: scale(1.12);
        }
        .remove-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .browse-btn:hover {
          background: #1d4ed8 !important;
          transform: translateY(-1px);
        }
      `}</style>

      <div style={{ maxWidth: '1100px', margin: '0 auto', animation: 'fadeIn 0.3s ease' }}>

        {/* Header */}
        <header style={{ marginBottom: '36px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' }}>
              My Account
            </div>
            <h1 style={{
              fontSize: '32px', fontWeight: '800', color: '#0f172a',
              margin: 0, fontFamily: "'DM Serif Display', serif", lineHeight: 1.1,
            }}>
              Saved Vehicles
            </h1>
            {!loading && (
              <p style={{ color: '#64748b', marginTop: '6px', fontSize: '14px', fontWeight: '500' }}>
                {items.length === 0
                  ? 'No saved vehicles yet'
                  : `${items.length} vehicle${items.length !== 1 ? 's' : ''} saved`}
              </p>
            )}
          </div>

          {!loading && items.length > 0 && (
            <button
              className="browse-btn"
              onClick={() => router.push('/vehicle')}
              style={{
                background: '#2563eb', color: '#fff', border: 'none',
                padding: '10px 20px', borderRadius: '10px',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: '600', fontSize: '14px',
                cursor: 'pointer', transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              Browse More
            </button>
          )}
        </header>

        {/* Divider */}
        <div style={{ height: '1px', background: 'linear-gradient(90deg, #e2e8f0, transparent)', marginBottom: '32px' }} />

        {/* Loading */}
        {loading && (
          <div className="wishlist-grid">
            {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!loading && items.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '80px 20px',
            background: '#fff', borderRadius: '20px',
            border: '1px dashed #cbd5e1',
            animation: 'fadeUp 0.4s ease',
          }}>
            <div style={{
              width: '72px', height: '72px', background: '#fff0f0',
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 20px',
            }}>
              <svg width="32" height="32" fill="none" stroke="#ef4444" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px' }}>
              Your wishlist is empty
            </h2>
            <p style={{ color: '#64748b', marginBottom: '28px', fontSize: '14px' }}>
              Save vehicles you love while browsing and they'll appear here.
            </p>
            <button
              className="browse-btn"
              onClick={() => router.push('/vehicle')}
              style={{
                background: '#2563eb', color: '#fff', border: 'none',
                padding: '13px 28px', borderRadius: '12px',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: '700', fontSize: '15px', cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              Browse Vehicles
            </button>
          </div>
        )}

        {/* Grid */}
        {!loading && items.length > 0 && (
          <div className="wishlist-grid">
            {items.map((item, idx) => (
              <div
                key={item.wishlist_id}
                className="wish-card"
                style={{ animationDelay: `${idx * 0.06}s` }}
                onClick={() => router.push(`/vehicle/${item.listing_id}`)}
              >
                {/* Remove button — outside image, top-right corner of card */}
                <button
                  className="remove-btn"
                  disabled={removing === item.listing_id}
                  onClick={(e) => removeItem(e, item.listing_id)}
                  title="Remove from wishlist"
                >
                  {removing === item.listing_id
                    ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <circle cx="12" cy="12" r="10" strokeDasharray="40" strokeDashoffset="10" style={{ animation: 'spin 0.7s linear infinite' }}/>
                      </svg>
                    : <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                  }
                </button>

                {/* Image */}
                <div className="card-image-wrap">
                  <img
                    src={item.image_url
                      ? `http://localhost:5000/uploads/${item.image_url}`
                      : `https://placehold.co/400x250/e8f0fe/2563eb?text=${encodeURIComponent(item.brand)}`}
                    alt={`${item.brand} ${item.model}`}
                  />
                  {/* Year badge */}
                  <span style={{
                    position: 'absolute', bottom: '10px', left: '10px',
                    background: 'rgba(255,255,255,0.92)',
                    color: '#2563eb', fontSize: '11px', fontWeight: '800',
                    padding: '3px 10px', borderRadius: '20px',
                    backdropFilter: 'blur(4px)',
                    letterSpacing: '0.04em',
                  }}>
                    {item.year}
                  </span>
                </div>

                {/* Info */}
                <div style={{ padding: '16px 18px 18px' }}>
                  <h3 style={{
                    fontSize: '17px', fontWeight: '700', color: '#0f172a',
                    margin: '0 0 10px', fontFamily: "'DM Serif Display', serif",
                    lineHeight: '1.2',
                  }}>
                    {item.brand} {item.model}
                  </h3>

                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <span style={{
                      fontSize: '17px', fontWeight: '800', color: '#0f172a',
                      fontFamily: "'DM Serif Display', serif",
                    }}>
                      PKR {Number(item.price).toLocaleString()}
                    </span>
                    <span style={{
                      fontSize: '12px', color: '#64748b', fontWeight: '500',
                      display: 'flex', alignItems: 'center', gap: '3px',
                    }}>
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                      {item.city}
                    </span>
                  </div>

                  {/* View CTA */}
                  <div style={{
                    marginTop: '14px', paddingTop: '14px',
                    borderTop: '1px solid #f1f5f9',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <span style={{ fontSize: '13px', color: '#2563eb', fontWeight: '600' }}>
                      View Details
                    </span>
                    <svg width="16" height="16" fill="none" stroke="#2563eb" strokeWidth="2.2" viewBox="0 0 24 24">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}