'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/providers'
import Sidebar from '@/components/layout/sidebar'
import DashboardHeader from '@/components/dashboard/dashboard-header'
import MetricsCards from '@/components/dashboard/metrics-cards'
import AIAssistant from '@/components/dashboard/ai-assistant'
import RecentActivity from '@/components/dashboard/recent-activity'
import ActiveProjects from '@/components/dashboard/active-projects'
import FloatingActionButtons from '@/components/layout/floating-action-buttons'
import { supabase } from '@/lib/supabase'

interface DashboardData {
  totalProjects: number
  activeTasks: number
  completedTasks: number
  teamMembers: number
  recentActivity: any[]
  activeProjects: any[]
}

export default function Dashboard() {
  const { user } = useAuth()
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
    if (user) {
      loadDashboardData()
    }
    setLoading(false)
  }, [user])

  const loadDashboardData = async () => {
    try {
      setLoadingData(true)
      
      // Try to load real data from Supabase
      try {
        const [projectsResult, tasksResult, activityResult] = await Promise.all([
          supabase.from('projects').select('*').eq('owner_id', user.id),
          supabase.from('tasks').select('*').eq('assignee_id', user.id),
          supabase.from('activity_logs').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10)
        ])

        const projects = projectsResult.data || []
        const tasks = tasksResult.data || []
        const activity = activityResult.data || []

        setDashboardData({
          totalProjects: projects.length,
          activeTasks: tasks.filter(t => t.status === 'in_progress').length,
          completedTasks: tasks.filter(t => t.status === 'completed').length,
          teamMembers: 2, // This would need a team_members table
          recentActivity: activity,
          activeProjects: projects.slice(0, 3)
        })
      } catch (supabaseError) {
        console.error('Supabase error, falling back to demo data:', supabaseError)
        
        // Fallback to demo data
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
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoadingData(false)
    }
  }

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
