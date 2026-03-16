'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

function Navbar() {
  return (
    <div className=" w-full h-[75px] px-12 bg-gray-100 border flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Link href={'/'} className='inline'>
        <Image
          src="/Images/Car.png"
          alt="AutoMarket logo"
          width={30}
          height={30}
          priority
        />
        </Link>
        <Link href={'/'}>
        <h2 className="font-bold text-xl lg:text-2xl cursor-pointer">AutoMarket</h2>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/login">
          <button className="px-3 py-2 rounded-sm font-semibold text-black hover:bg-gray-200 transition cursor-pointer">
            Login
          </button>
        </Link>

        <Link href="/Sign-up">
          <button className="px-3 py-2 bg-blue-600 rounded-sm text-white font-semibold hover:bg-blue-700 transition cursor-pointer">
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Navbar
