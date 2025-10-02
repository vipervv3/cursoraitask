'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
// Demo mode - no auth provider needed
import { 
  LayoutDashboard, 
  FolderOpen, 
  CheckSquare, 
  Brain, 
  BarChart3, 
  FileText, 
  Calendar,
  Users,
  Shield,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()

  useEffect(() => {
    // Check for demo user in localStorage as fallback
    const demoUser = localStorage.getItem('demo-user')
    if (demoUser) {
      setUser(JSON.parse(demoUser))
    }
  }, [])

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, current: pathname === '/dashboard' },
    { name: 'My Projects', href: '/projects', icon: FolderOpen, current: pathname === '/projects' },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare, current: pathname === '/tasks' },
    { name: 'AI Insights', href: '/ai-insights', icon: Brain, badge: 'AI', current: pathname === '/ai-insights' },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, badge: '30', current: pathname === '/analytics' },
    { name: 'Reports', href: '/reports', icon: FileText, badge: '30', current: pathname === '/reports' },
    { name: 'Meetings', href: '/meetings', icon: Calendar, current: pathname === '/meetings' },
    { name: 'Calendar', href: '/calendar', icon: Calendar, current: pathname === '/calendar' },
    { name: 'Team', href: '/team', icon: Users, current: pathname === '/team' },
    { name: 'Security', href: '/security', icon: Shield, badge: '🔒', current: pathname === '/security' },
    { name: 'Settings', href: '/settings', icon: Settings, current: pathname === '/settings' },
  ]

  const handleSignOut = async () => {
    localStorage.removeItem('demo-user')
    window.location.href = '/'
  }

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
      collapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'
    }`}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold text-gray-900">AI ProjectHub</h1>
                <p className="text-xs text-gray-500">Intelligent Management</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md hover:bg-gray-100 lg:hidden"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                item.current
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <item.icon className={`mr-3 h-5 w-5 ${
                item.current ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
              }`} />
              <span className="flex-1">{item.name}</span>
              {item.badge && (
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  item.current 
                    ? 'bg-white/20 text-white' 
                    : 'bg-blue-600 text-white'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {user?.name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || 'Demo User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
            )}
          </div>
          
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="mr-3 h-4 w-4 text-gray-400" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}
