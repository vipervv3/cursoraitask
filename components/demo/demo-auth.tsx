'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowRight, Fingerprint } from 'lucide-react'

export default function DemoAuth() {
  const [email, setEmail] = useState('demo@aiprojecthub.com')
  const [password, setPassword] = useState('demo123')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate login process
    setTimeout(() => {
      setLoading(false)
      // Store demo user in localStorage
      localStorage.setItem('demo-user', JSON.stringify({
        id: 'demo-user-id',
        email: email,
        name: 'Demo User',
        avatar_url: null
      }))
      router.push('/dashboard')
    }, 1000)
  }

  const handleBiometric = () => {
    alert('Biometric authentication would be available with proper setup')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🧠</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your AI ProjectHub account</p>
          </div>

          {/* Demo Notice */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xs text-blue-600">ℹ</span>
              </div>
              <p className="text-sm text-blue-700">
                <strong>Demo Mode:</strong> Use the pre-filled credentials to explore the application
              </p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input mt-1"
              />
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg w-full"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR CONTINUE WITH</span>
            </div>
          </div>

          {/* Biometric Authentication */}
          <button
            onClick={handleBiometric}
            className="btn btn-outline w-full mb-4"
          >
            <Fingerprint className="mr-2 h-5 w-5" />
            Use Fingerprint or Face ID
          </button>

          {/* Setup Info */}
          <div className="flex items-center justify-center text-sm text-gray-500">
            <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center mr-2">
              <span className="text-xs">ℹ</span>
            </div>
            Set up fingerprint or Face ID authentication in Settings after logging in
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button className="text-primary hover:text-primary/80 font-medium">
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
