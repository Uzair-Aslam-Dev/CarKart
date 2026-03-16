import React from 'react'
import Image from 'next/image'

function HowitWorks() {
  return (
    <section className="w-full py-20 bg-gray-50">

      <div className="max-w-7xl mx-auto text-center mb-16 px-6">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900">
          How it Works
        </h1>
        <p className="mt-4 text-gray-500 font-medium text-lg">
          Simple steps to buy and sell your cars online
        </p>
      </div>

  
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-6">
        
       
        <div className="group bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-blue-100 group-hover:bg-blue-600 transition">
            <Image src="/Images/user.png" width={40} height={40} alt="user" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gray-900">
            Create Account
          </h2>
          <p className="text-gray-500 font-medium leading-relaxed">
            Sign up as a buyer or seller in seconds. <br />
            Choose your role and get started immediately.
          </p>
        </div>

     
        <div className="group bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-blue-100 group-hover:bg-blue-600 transition">
            <Image src="/Images/magnifying-glass.png" width={40} height={40} alt="browse" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gray-900">
            Browse or List
          </h2>
          <p className="text-gray-500 font-medium leading-relaxed">
            Buyers can search thousands of cars. <br />
            Sellers can list vehicles with detailed info.
          </p>
        </div>

       
        <div className="group bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-blue-100 group-hover:bg-blue-600 transition">
            <Image src="/Images/handshake.png" width={40} height={40} alt="deal" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gray-900">
            Complete Deal
          </h2>
          <p className="text-gray-500 font-medium leading-relaxed">
            Secure transactions with our built-in approval system.
          </p>
        </div>

      </div>
    </section>
  )
}

export default HowitWorks
