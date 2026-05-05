'use client'

import React, { useState } from 'react'

type SellerEditListingModalProps = {
  isOpen: boolean
  listingid: number
  vehicleid: number
  initialBrand: string
  initialModel: string
  initialMileage: number
  initialPrice: number
  initialStatus: string
  onClose: () => void
  onUpdated: () => void
}

function SellerEditListingModal({
  isOpen,
  listingid,
  vehicleid,
  initialBrand,
  initialModel,
  initialMileage,
  initialPrice,
  initialStatus,
  onClose,
  onUpdated
}: SellerEditListingModalProps) {
  const [brand, setBrand] = useState(initialBrand)
  const [model, setModel] = useState(initialModel)
  const [mileage, setMileage] = useState(String(initialMileage))
  const [price, setPrice] = useState(String(initialPrice))
  const [status, setStatus] = useState(initialStatus.toLowerCase())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  React.useEffect(() => {
    if (!isOpen) return
    setBrand(initialBrand)
    setModel(initialModel)
    setMileage(String(initialMileage))
    setPrice(String(initialPrice))
    setStatus(initialStatus.toLowerCase())
    setError('')
  }, [isOpen, initialBrand, initialModel, initialMileage, initialPrice, initialStatus])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const parsedMileage = Number(mileage)
    const parsedPrice = Number(price)

    if (!brand.trim() || !model.trim()) {
      setError('Brand and model are required.')
      return
    }

    if (Number.isNaN(parsedMileage) || parsedMileage < 0) {
      setError('Please enter a valid mileage.')
      return
    }

    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      setError('Please enter a valid price.')
      return
    }

    try {
      setLoading(true)
      const res = await fetch('http://localhost:5000/users/editlisting', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          listingid,
          vehicleid,
          brand: brand.trim(),
          model: model.trim(),
          mileage: parsedMileage,
          price: parsedPrice,
          status
        })
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data?.message || 'Failed to update listing.')
        return
      }

      onUpdated()
      onClose()
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4'>
      <div className='w-full max-w-lg rounded-xl bg-white p-6 shadow-xl'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-lg font-semibold text-gray-900'>Edit Listing</h2>
          <button
            type='button'
            className='rounded px-2 py-1 text-gray-500 hover:bg-gray-100'
            onClick={onClose}
            disabled={loading}
          >
            X
          </button>
        </div>

        <form onSubmit={handleSubmit} className='space-y-3'>
          <input
            type='text'
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder='Brand'
            className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500'
          />

          <input
            type='text'
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder='Model'
            className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500'
          />

          <input
            type='number'
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            placeholder='Mileage'
            className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500'
          />

          <input
            type='number'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder='Price'
            className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500'
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500'
          >
            <option value='active'>Active</option>
            <option value='inactive'>Inactive</option>
            <option value='sold'>Sold</option>
          </select>

          {error && <p className='text-sm text-red-600'>{error}</p>}

          <div className='mt-4 flex justify-end gap-2'>
            <button
              type='button'
              className='rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60'
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SellerEditListingModal
