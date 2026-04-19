'use client'

import React, { useState } from 'react'
import {
  Car,
  Calendar,
  Gauge,
  MapPin,
  Palette,
  FileText,
  CircleCheck,
  CircleX,
  Info
} from 'lucide-react'

function NewAdd() {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    mileage_km: '',
    condition: '',
    location_city: '',
    status: '',
    color: '',
    description: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formData)
    try {
     const response = await fetch("http://localhost:5000/cars/newcar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

            const result = await response;

            if(response.ok) {
                console.log("Car added");
            }
            else {
                console.log("error");
            }

        }
        catch(e) {



        }
  }

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8">

        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Car className="w-6 h-6 text-blue-600" />
          Create Car Listing
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Make */}
          <div className="relative">
            <Car className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Make"
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                setFormData({ ...formData, make: e.target.value })
              }
            />
          </div>

          {/* Model */}
          <div className="relative">
            <Info className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Model"
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                setFormData({ ...formData, model: e.target.value })
              }
            />
          </div>

          {/* Year */}
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input
              type="number"
              placeholder="Year"
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                setFormData({ ...formData, year: e.target.value })
              }
            />
          </div>

          {/* Mileage */}
          <div className="relative">
            <Gauge className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input
              type="number"
              placeholder="Mileage (KM)"
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                setFormData({ ...formData, mileage_km: e.target.value })
              }
            />
          </div>

          {/* Condition */}
          <div className="relative">
            <CircleCheck className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <select
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                setFormData({ ...formData, condition: e.target.value })
              }
            >
              <option value="">Condition</option>
              <option value="new">New</option>
              <option value="used">Used</option>
            </select>
          </div>

          {/* City */}
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="City"
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                setFormData({ ...formData, location_city: e.target.value })
              }
            />
          </div>

          {/* Status */}
          <div className="relative">
            <CircleX className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <select
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="">Status</option>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
            </select>
          </div>

          {/* Color */}
          <div className="relative">
            <Palette className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Color"
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
            />
          </div>

          {/* Description */}
          <div className="relative md:col-span-2">
            <FileText className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <textarea
              placeholder="Description"
              className="w-full pl-10 pr-3 py-2 border rounded-lg h-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
          >
            Submit Listing
          </button>

        </form>
      </div>
    </div>
  )
}

export default NewAdd