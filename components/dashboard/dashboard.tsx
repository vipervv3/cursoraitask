'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/layout/sidebar'
import DashboardHeader from '@/components/dashboard/dashboard-header'
import MetricsCards from '@/components/dashboard/metrics-cards'
import AIAssistant from '@/components/dashboard/ai-assistant'
import RecentActivity from '@/components/dashboard/recent-activity'
import ActiveProjects from '@/components/dashboard/active-projects'
import FloatingActionButtons from '@/components/layout/floating-action-buttons'
// Demo mode - no external dependencies needed

interface DashboardData {
  totalProjects: number
  activeTasks: number
  completedTasks: number
  teamMembers: number
  recentActivity: any[]
  activeProjects: any[]
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalProjects: 0,
    activeTasks: 0,
    completedTasks: 0,
    teamMembers: 0,
    recentActivity: [],
    activeProjects: []
  })
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    // Get demo user from localStorage
    const demoUser = localStorage.getItem('demo-user')
    if (demoUser) {
      setUser(JSON.parse(demoUser))
      loadDashboardData()
    }
    setLoading(false)
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoadingData(true)
      
      // Demo data for testing
      const demoProjects = [
        {
          id: '1',
          name: 'Copilot Integration',
          progress: 0,
          status: 'active',
          due_date: '2024-01-15',
          created_at: '2024-01-01'
        },
        {
          id: '2',
          name: 'Dataverse Setup',
          progress: 25,
          status: 'active',
          due_date: '2024-01-20',
          created_at: '2024-01-02'
        },
        {
          id: '3',
          name: 'FO Summit Planning',
          progress: 30,
          status: 'active',
          due_date: '2024-01-25',
          created_at: '2024-01-03'
        }
      ]

      const demoActivity = [
        {
          id: '1',
          action: 'updated',
          entity_type: 'task',
          details: { name: 'Set up demonstration of Power Automate flow' },
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          action: 'updated',
          entity_type: 'task',
          details: { name: 'Recreate separate section for deactivated employees' },
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          action: 'updated',
          entity_type: 'task',
          details: { name: 'Coordinate evening activities for summit' },
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]

      setDashboardData({
        totalProjects: 17,
        activeTasks: 25,
        completedTasks: 15,
        teamMembers: 2,
        recentActivity: demoActivity,
        activeProjects: demoProjects
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoadingData(false)
    }
  }

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 lg:pl-64">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <DashboardHeader user={user} />
              
              <div className="mt-8">
                <MetricsCards data={dashboardData} />
              </div>

              <div className="mt-8">
                <AIAssistant />
              </div>

              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RecentActivity activities={dashboardData.recentActivity} />
                <ActiveProjects projects={dashboardData.activeProjects} />
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <FloatingActionButtons />
    </div>
  )
}
