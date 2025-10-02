'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/providers'
import Sidebar from '@/components/layout/sidebar'
import FloatingActionButtons from '@/components/layout/floating-action-buttons'
import KanbanBoard from '@/components/tasks/kanban-board'
import TaskFilters from '@/components/tasks/task-filters'
import { supabase } from '@/lib/supabase'
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
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    project: 'all'
  })

  useEffect(() => {
    if (user) {
      loadTasks()
    }
  }, [user, filters])

  const loadTasks = async () => {
    try {
      setLoading(true)
      
      let query = supabase
        .from('tasks')
        .select(`
          *,
          projects!inner(*)
        `)
        .eq('projects.owner_id', user?.id)
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters.status !== 'all') {
        query = query.eq('status', filters.status)
      }
      
      if (filters.priority !== 'all') {
        query = query.eq('priority', filters.priority)
      }
      
      if (filters.project !== 'all') {
        query = query.eq('project_id', filters.project)
      }

      const { data, error } = await query

      if (error) throw error

      setTasks(data || [])
    } catch (error) {
      console.error('Error loading tasks:', error)
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          status: newStatus,
          completed_at: newStatus === 'completed' ? new Date().toISOString() : null
        })
        .eq('id', taskId)

      if (error) throw error

      // Update local state
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, status: newStatus as any }
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
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
                <p className="mt-2 text-gray-600">
                  Smart prioritization active - overdue and urgent tasks auto-promoted
                </p>
              </div>

              {/* Filters and Stats */}
              <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <TaskFilters filters={filters} onFiltersChange={setFilters} />
                
                <div className="flex items-center space-x-6">
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
