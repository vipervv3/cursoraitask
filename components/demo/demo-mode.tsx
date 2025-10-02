'use client'

import { useState } from 'react'
import { AlertTriangle, CheckCircle, Info } from 'lucide-react'

export default function DemoMode() {
  const [isDemoMode, setIsDemoMode] = useState(true)

  if (!isDemoMode) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-100 border-b border-yellow-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                Demo Mode - AI ProjectHub
              </h3>
              <p className="text-sm text-yellow-700">
                This is a demonstration version. Some features require external services to be configured.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDemoMode(false)}
            className="text-yellow-600 hover:text-yellow-800"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
