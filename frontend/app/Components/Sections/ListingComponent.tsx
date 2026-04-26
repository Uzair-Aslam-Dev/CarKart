import React from 'react'

interface ListingProps {
  img: string
  brand: string
  model: string
  mileage: string
  price: string
  status: string
  date: string
}

function ListingComponent({ img, brand, model, mileage, price, status, date }: ListingProps) {
  const isActive = status === 'Active'

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      background: '#fff',
      border: '1px solid #e8e8e8',
      borderRadius: '10px',
      padding: '14px 20px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      {/* Car Image */}
      <img
        src={img}
        alt={`${brand} ${model}`}
        style={{ width: 96, height: 64, objectFit: 'cover', borderRadius: 6, background: '#eee' }}
      />

      {/* Name + Meta */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: '0 0 3px', fontSize: 15, fontWeight: 600, color: '#111' }}>{brand} {model}</p>
        <p style={{ margin: 0, fontSize: 13, color: '#777' }}>{mileage}</p>
      </div>

      {/* Price */}
      <div style={{ minWidth: 100, textAlign: 'center', fontSize: 17, fontWeight: 700, color: '#111' }}>
        {price}
      </div>

      {/* Status Badge */}
      <div style={{ minWidth: 80, textAlign: 'center' }}>
        <span style={{
          display: 'inline-block',
          padding: '3px 12px',
          borderRadius: 20,
          fontSize: 12,
          fontWeight: 600,
          background: isActive ? '#e6f9f0' : '#f0f0f0',
          color: isActive ? '#1a9e5c' : '#888',
        }}>
          {status}
        </span>
      </div>

      {/* Date */}
      <div style={{ fontSize: 13, color: '#888', minWidth: 90, textAlign: 'right' }}>
        {date}
      </div>
    </div>
  )
}

export default ListingComponent