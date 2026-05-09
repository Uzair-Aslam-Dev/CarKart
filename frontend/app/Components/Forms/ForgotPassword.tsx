'use client'

import React, { useState } from 'react'
import Link from 'next/link'

type Step = 1 | 2

export default function ForgotPasswordForm() {
  const [step, setStep] = useState<Step>(1)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const goToPasswordStep = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!username.trim()) {
      setError('Enter your username to continue.')
      return
    }

    setStep(2)
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!username.trim()) {
      setStep(1)
      setError('Enter your username.')
      return
    }

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    try {
      setLoading(true)
      const res = await fetch('http://localhost:5000/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          newPassword: password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.errors?.[0]?.msg) {
          setError(data.errors[0].msg)
        } else if (res.status === 404) {
          setError(data.message ?? 'Username not found. Go back and check your username.')
        } else {
          setError(data.message || 'Could not reset password.')
        }
        return
      }

      setPassword('')
      setConfirm('')
      setStep(1)
      setUsername('')
      setMessage(data.message || 'Password updated. You can sign in now.')
    } catch {
      setError('Network error.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full from-blue-50 to-indigo-50 flex items-center justify-center ">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot password</h1>
          <p className="text-gray-600 text-sm">
            {step === 1
              ? 'Enter the username you use to sign in.'
              : `Set a new password for ${username.trim()}`}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={goToPasswordStep}>
            <div className="mb-4">
              <label htmlFor="fp-username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                id="fp-username"
                type="text"
                autoComplete="username"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
              <p className="mt-2 text-xs text-gray-500">Required before you choose a new password.</p>
            </div>

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            {message && <p className="text-green-700 text-sm mb-3">{message}</p>}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition mb-4"
            >
              Continue
            </button>

            <p className="text-center text-sm text-gray-600">
              <Link href="/login" className="text-indigo-600 font-medium hover:text-indigo-700">
                Back to sign in
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleReset}>
            <div className="mb-4 rounded-lg bg-gray-50 border border-gray-100 px-3 py-2 text-sm text-gray-700">
              <span className="text-gray-500">Username:</span>{' '}
              <span className="font-medium">{username.trim()}</span>
            </div>

            <div className="mb-4">
              <label htmlFor="fp-new" className="block text-sm font-medium text-gray-700 mb-2">
                New password
              </label>
              <input
                id="fp-new"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="2–24 characters"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="fp-confirm" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm new password
              </label>
              <input
                id="fp-confirm"
                type="password"
                autoComplete="new-password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            {message && <p className="text-green-700 text-sm mb-3">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60 mb-2"
            >
              {loading ? 'Saving…' : 'Reset password'}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setStep(1)
                setError('')
                setPassword('')
                setConfirm('')
              }}
              className="w-full mb-4 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              Back to username
            </button>

            <p className="text-center text-sm text-gray-600">
              <Link href="/login" className="text-indigo-600 font-medium hover:text-indigo-700">
                Back to sign in
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
