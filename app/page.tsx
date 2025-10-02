'use client'

import { useAuth } from '@/app/providers'
import Dashboard from '@/components/dashboard/dashboard'
import DemoAuth from '@/components/demo/demo-auth'
import DemoMode from '@/components/demo/demo-mode'

export default function HomePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
