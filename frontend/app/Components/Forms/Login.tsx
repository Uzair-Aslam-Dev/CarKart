'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
export default function LoginForm() {
  const [username , setUsername] = useState('');
  const [password , setpassword] = useState('');
  const router  = useRouter();

  const handlelogin = async () => {
    console.log("Button clicked");
    const data = { username, password };

    try {
        const response = await fetch("http://localhost:5000/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data) ,
             credentials: 'include' 
        });

        const result = await response.json();

        if (response.ok) {                   

            console.log("Login successful");
           
            router.push('/Dashboard')
            
        } else {
            if (result.errors && result.errors.length > 0) {
        
       console.log("Validation error")
    } else {
   
        console.log("Login failed:", result.message);
    }
        }
    } catch (e) {
        console.log(e);
    }
}

  return (
    <div className="w-full from-blue-50 to-indigo-50 flex items-center justify-center ">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>

        <form onSubmit={(e)=> { e.preventDefault()}}>
         
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Enter your Username"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                onChange={(e) => { setUsername(e.target.value)}}
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <span className="text-sm text-indigo-600 hover:text-indigo-700 cursor-pointer font-medium">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                onChange={(e) => { setpassword(e.target.value)}}
              />
            </div>
          </div>

          {/* Remember Me */}
        

        
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-lg hover:shadow-xl mb-6"
            onClick={handlelogin}
          >
            Sign In
          </button>

          {/* Create Account Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <span className="text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer">
                <Link href={'/Sign-up'}>Create an account</Link>
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}