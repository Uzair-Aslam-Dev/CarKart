import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface CardProps {
  image: string
  price: number
  year: number
  title: string
  mileage: number
  url: string
}

function CarDisplay({ image, price, year, title, mileage, url }: CardProps) {
  return (
    <div className="group w-[320px] h-[420px] bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">

      {/* Image */}
      <div className="relative w-full h-52">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-4">

        {/* Price + Year */}
        <div className="flex items-center justify-between">
          <p className="text-2xl font-extrabold text-blue-600">
            PKR {price?.toLocaleString()}
          </p>
          <span className="text-sm text-gray-500 font-medium">{year}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{title}</h3>

        {/* Mileage */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Image src="/Images/mileage.png" alt="mileage" width={18} height={18} />
          <span>{mileage?.toLocaleString()} km</span>
        </div>

        {/* Button */}
        <Link href={url}>
          <button className="w-full mt-2 px-5 py-3 bg-blue-600 rounded-lg text-white font-semibold shadow hover:bg-blue-700 transition">
            View Details
          </button>
        </Link>

      </div>
    </div>
  )
}

export default CarDisplay