'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Dashboard from '@/components/dashboard/dashboard'
import DemoAuth from '@/components/demo/demo-auth'
import DemoMode from '@/components/demo/demo-mode'

export default function HomePage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for demo user in localStorage
    const demoUser = localStorage.getItem('demo-user')
    if (demoUser) {
      setUser(JSON.parse(demoUser))
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return <DemoAuth />
  }

  return (
    <>
      <DemoMode />
      <Dashboard />
    </>
  )
}
