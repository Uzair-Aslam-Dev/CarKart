import React from 'react'
import Image from 'next/image'

function IntroSection() {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 px-6 lg:px-12 h-100 py-4 w-full '>
      
      <div className='flex flex-col items-center lg:items-start justify-center gap-5 text-center lg:text-left'>
        <h1 className='text-black text-4xl lg:text-5xl font-extrabold leading-tight'>
          Buy and Sell Cars <br className="hidden lg:block" /> Online
        </h1>

        <p className='text-gray-500 max-w-md text-base leading-relaxed'>
          The easiest way to find your dream car or sell your vehicle online
          to thousands of buyers. Trusted, secure, and hassle-free.
        </p>

        <div className='flex items-center justify-center lg:justify-start gap-4'>
          <button className="px-5 py-3 bg-blue-600 rounded-md text-white font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition cursor-pointer">
            Browse Cars
          </button>

          <button className="px-5 py-3 rounded-md font-semibold text-black border-2 border-black hover:bg-black hover:text-white transition cursor-pointer">
            Sell your car
          </button>
        </div>
      </div>

      <div className='px-6 lg:px-12 flex items-center justify-center'>
        <div className='w-4/5 h-full flex items-center justify-center'>
                <Image
        src={'/Images/car-banner.jpg'}
        width={700}
        height={1050}
        alt='car banner'
        className='rounded-2xl shadow-xl object-cover h-full'
        priority
        />

        </div>
      </div>

    </div>
  )
}

export default IntroSection
