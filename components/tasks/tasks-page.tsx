'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/layout/sidebar'
import FloatingActionButtons from '@/components/layout/floating-action-buttons'
import KanbanBoard from '@/components/tasks/kanban-board'
import TaskFilters from '@/components/tasks/task-filters'
import { toast } from 'react-hot-toast'

interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  ai_priority_score?: number
  is_ai_generated?: boolean
  due_date?: string
  project_id: string
  assignee_id?: string
  projects: {
    name: string
  }
  created_at: string
  updated_at: string
}

export default function TasksPage() {
  const [user, setUser] = useState<any>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    project: 'all'
  })

  useEffect(() => {
    // Get demo user from localStorage
    const demoUser = localStorage.getItem('demo-user')
    if (demoUser) {
      setUser(JSON.parse(demoUser))
      loadTasks()
    }
    setLoading(false)
  }, [filters])

  const loadTasks = async () => {
    try {
      setLoading(true)
      
      // Demo data for testing
      const demoTasks = [
        {
          id: '1',
          title: 'Set up demonstration of Power Automate flow',
          description: 'Create a comprehensive demo showing the Power Automate workflow for the new process',
          status: 'in_progress' as const,
          priority: 'high' as const,
          ai_priority_score: 85,
          is_ai_generated: true,
          due_date: '2024-01-15',
          project_id: '1',
          projects: { name: 'Copilot Integration' },
          created_at: '2024-01-01T10:00:00Z',
          updated_at: '2024-01-01T10:00:00Z'
        },
        {
          id: '2',
          title: 'Recreate separate section for deactivated employees',
          description: 'Build a new section to handle deactivated employee records separately',
          status: 'todo' as const,
          priority: 'urgent' as const,
          ai_priority_score: 95,
          is_ai_generated: true,
          due_date: '2024-01-12',
          project_id: '2',
          projects: { name: 'Dataverse Setup' },
          created_at: '2024-01-01T11:00:00Z',
          updated_at: '2024-01-01T11:00:00Z'
        },
        {
          id: '3',
          title: 'Coordinate evening activities for summit',
          description: 'Plan and organize evening activities for the upcoming summit event',
          status: 'completed' as const,
          priority: 'medium' as const,
          ai_priority_score: 60,
          is_ai_generated: false,
          due_date: '2024-01-10',
          project_id: '3',
          projects: { name: 'FO Summit Planning' },
          created_at: '2024-01-01T12:00:00Z',
          updated_at: '2024-01-01T12:00:00Z'
        },
        {
          id: '4',
          title: 'Review AI integration requirements',
          description: 'Analyze and document all requirements for AI service integration',
          status: 'todo' as const,
          priority: 'high' as const,
          ai_priority_score: 80,
          is_ai_generated: true,
          due_date: '2024-01-18',
          project_id: '1',
          projects: { name: 'Copilot Integration' },
          created_at: '2024-01-01T13:00:00Z',
          updated_at: '2024-01-01T13:00:00Z'
        },
        {
          id: '5',
          title: 'Update project documentation',
          description: 'Complete the project documentation with latest changes and updates',
          status: 'in_progress' as const,
          priority: 'low' as const,
          ai_priority_score: 40,
          is_ai_generated: false,
          due_date: '2024-01-20',
          project_id: '2',
          projects: { name: 'Dataverse Setup' },
          created_at: '2024-01-01T14:00:00Z',
          updated_at: '2024-01-01T14:00:00Z'
        }
      ]

      // Apply filters
      let filteredTasks = demoTasks

      if (filters.status !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.status === filters.status)
      }
      
      if (filters.priority !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.priority === filters.priority)
      }
      
      if (filters.project !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.project_id === filters.project)
      }

      setTasks(filteredTasks)
    } catch (error) {
      console.error('Error loading tasks:', error)
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      // Update local state
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, status: newStatus as any, updated_at: new Date().toISOString() }
          : task
      ))

      toast.success('Task updated successfully')
    } catch (error) {
      console.error('Error updating task:', error)
      toast.error('Failed to update task')
    }
  }

  const autoPrioritizedTasks = tasks.filter(task => task.is_ai_generated && task.priority === 'urgent').length

  if (loading) {
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
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
                <p className="mt-2 text-gray-600">
                  AI-powered task management with smart prioritization and intelligent insights
                </p>
              </div>

              {/* Task Stats */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                <div className="card">
                  <div className="card-content">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                        <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
                      </div>
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm">📋</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-content">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">To Do</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {tasks.filter(t => t.status === 'todo').length}
                        </p>
                      </div>
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 text-sm">⏳</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-content">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">In Progress</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {tasks.filter(t => t.status === 'in_progress').length}
                        </p>
                      </div>
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-yellow-600 text-sm">🔄</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-content">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Completed</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {tasks.filter(t => t.status === 'completed').length}
                        </p>
                      </div>
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm">✅</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-content">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">AI Generated</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {tasks.filter(t => t.is_ai_generated).length}
                        </p>
                      </div>
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 text-sm">🤖</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Insights Banner */}
              <div className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">🧠</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Task Intelligence</h3>
                    <p className="text-gray-700 mb-3">
                      AI has identified {autoPrioritizedTasks} high-priority tasks that need immediate attention. 
                      Consider focusing on "Recreate separate section for deactivated employees" as it's marked urgent and due soon.
                    </p>
                    <div className="flex space-x-4">
                      <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                        View AI Analysis →
                      </button>
                      <button className="text-gray-600 hover:text-gray-700 font-medium text-sm">
                        Auto-Schedule Tasks
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters and Actions */}
              <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <TaskFilters filters={filters} onFiltersChange={setFilters} />
                
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    {tasks.length} tasks shown
                  </div>
                  <div className="text-sm text-gray-600">
                    {autoPrioritizedTasks} auto-prioritized
                  </div>
                  <button className="btn btn-primary">
                    + New Task
                  </button>
                </div>
              </div>

              {/* Kanban Board */}
              <KanbanBoard 
                tasks={tasks}
                onTaskUpdate={updateTaskStatus}
              />
            </div>
          </div>
        </main>
      </div>
      
      <FloatingActionButtons />
    </div>
  )
}
