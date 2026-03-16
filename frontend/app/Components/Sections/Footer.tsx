'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

function Footer() {
  return (
    <footer className="bg-blue-600 text-white w-full">
      <div className="grid grid-cols-2 lg:grid-cols-4 px-12 py-20 gap-y-12">

        <div className="flex flex-col gap-4 items-center justify-center text-center">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/Images/Car.png"
              alt="AutoMarket logo"
              width={34}
              height={34}
              priority
            />
            <h2 className="font-bold text-2xl lg:text-3xl">
              AutoMarket
            </h2>
          </Link>
          <p className="text-sm text-blue-100 max-w-xs leading-relaxed">
            Your trusted platform for buying and selling cars online
          </p>
        </div>

        <div className="flex flex-col gap-3 items-center justify-center">
          <span className="font-semibold text-xl tracking-wide">
            For Buyers
          </span>
          <span className="text-sm text-blue-100 hover:text-white cursor-pointer transition">
            Search Cars
          </span>
          <span className="text-sm text-blue-100 hover:text-white cursor-pointer transition">
            Search by Brand
          </span>
          <span className="text-sm text-blue-100 hover:text-white cursor-pointer transition">
            Buyer Guide
          </span>
        </div>

        <div className="flex flex-col gap-3 items-center justify-center">
          <span className="font-semibold text-xl tracking-wide">
            For Sellers
          </span>
          <span className="text-sm text-blue-100 hover:text-white cursor-pointer transition">
            List your car
          </span>
          <span className="text-sm text-blue-100 hover:text-white cursor-pointer transition">
            Seller Dashboard
          </span>
          <span className="text-sm text-blue-100 hover:text-white cursor-pointer transition">
            Seller Guide
          </span>
        </div>

        <div className="flex flex-col gap-3 items-center justify-center">
          <span className="font-semibold text-xl tracking-wide">
            Team :)
          </span>
          <span className="text-sm text-blue-100">Abdullah Imran</span>
          <span className="text-sm text-blue-100">Uzair Aslam</span>
          <span className="text-sm text-blue-100">Saad Naeem</span>
          <span className="text-sm text-blue-100">Pari Batra</span>
        </div>

      </div>

      <div className="border-t border-blue-500 text-center py-4 text-sm text-blue-100">
        © {new Date().getFullYear()} AutoMarket. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
