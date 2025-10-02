'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/providers'
import Sidebar from '@/components/layout/sidebar'
import FloatingActionButtons from '@/components/layout/floating-action-buttons'
import AnalyticsHeader from './analytics-header'
import MetricsOverview from './metrics-overview'
import ProductivityChart from './productivity-chart'
import ProjectAnalytics from './project-analytics'
import TaskAnalytics from './task-analytics'
import TeamPerformance from './team-performance'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

interface AnalyticsData {
  totalProjects: number
  totalTasks: number
  completedTasks: number
  activeProjects: number
  teamMembers: number
  productivityTrend: number
  averageCompletionTime: number
  projectSuccessRate: number
}

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    activeProjects: 0,
    teamMembers: 0,
    productivityTrend: 0,
    averageCompletionTime: 0,
    projectSuccessRate: 0
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  useEffect(() => {
    if (user) {
      loadAnalyticsData()
    }
  }, [user, timeRange])

  const loadAnalyticsData = async () => {
    try {
      setLoading(true)
      
      // Load projects
      const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('owner_id', user?.id)

      // Load tasks
      const { data: tasks } = await supabase
        .from('tasks')
        .select(`
          *,
          projects!inner(*)
        `)
        .eq('projects.owner_id', user?.id)

      // Calculate analytics
      const totalProjects = projects?.length || 0
      const totalTasks = tasks?.length || 0
      const completedTasks = tasks?.filter(task => task.status === 'completed').length || 0
      const activeProjects = projects?.filter(project => project.status === 'active').length || 0
      
      // Calculate productivity trend (mock calculation)
      const productivityTrend = completedTasks > 0 ? ((completedTasks / totalTasks) * 100) : 0
      
      // Calculate average completion time (mock)
      const averageCompletionTime = 2.5 // days
      
      // Calculate project success rate
      const completedProjects = projects?.filter(project => project.status === 'completed').length || 0
      const projectSuccessRate = totalProjects > 0 ? ((completedProjects / totalProjects) * 100) : 0

      setAnalyticsData({
        totalProjects,
        totalTasks,
        completedTasks,
        activeProjects,
        teamMembers: 1, // Single user for now
        productivityTrend,
        averageCompletionTime,
        projectSuccessRate
      })
    } catch (error) {
      console.error('Error loading analytics data:', error)
      toast.error('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
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
              <AnalyticsHeader 
                timeRange={timeRange}
                onTimeRangeChange={setTimeRange}
              />
              
              {/* Metrics Overview */}
              <div className="mt-8">
                <MetricsOverview data={analyticsData} />
              </div>

              {/* Charts and Analytics */}
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ProductivityChart timeRange={timeRange} />
                <ProjectAnalytics data={analyticsData} />
              </div>

              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <TaskAnalytics data={analyticsData} />
                <TeamPerformance data={analyticsData} />
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <FloatingActionButtons />
    </div>
  )
}
