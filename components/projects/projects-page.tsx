'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/providers'
import Sidebar from '@/components/layout/sidebar'
import FloatingActionButtons from '@/components/layout/floating-action-buttons'
import ProjectGrid from '@/components/projects/project-grid'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

interface Project {
  id: string
  name: string
  description: string
  status: string
  progress: number
  budget_allocated: number
  budget_spent: number
  start_date: string
  due_date: string
  created_at: string
  updated_at: string
}

export default function ProjectsPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadProjects()
    }
  }, [user])

  const loadProjects = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('owner_id', user?.id)
        .order('updated_at', { ascending: false })

      if (error) throw error

      setProjects(data || [])
    } catch (error) {
      console.error('Error loading projects:', error)
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (projectData: Partial<Project>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          ...projectData,
          owner_id: user?.id
        })
        .select()
        .single()

      if (error) throw error

      setProjects(prev => [data, ...prev])
      toast.success('Project created successfully')
      return data
    } catch (error) {
      console.error('Error creating project:', error)
      toast.error('Failed to create project')
      throw error
    }
  }

  const updateProject = async (projectId: string, updates: Partial<Project>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId)
        .select()
        .single()

      if (error) throw error

      setProjects(prev => prev.map(project => 
        project.id === projectId ? data : project
      ))
      toast.success('Project updated successfully')
    } catch (error) {
      console.error('Error updating project:', error)
      toast.error('Failed to update project')
    }
  }

  const deleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)

      if (error) throw error

      setProjects(prev => prev.filter(project => project.id !== projectId))
      toast.success('Project deleted successfully')
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('Failed to delete project')
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
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
                    <p className="mt-2 text-gray-600">Your personal projects and collaborations</p>
                  </div>
                  <button 
                    onClick={() => {/* TODO: Open create project modal */}}
                    className="btn btn-primary"
                  >
                    + New Project
                  </button>
                </div>
              </div>

              {/* Project Summary */}
              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 text-sm">👑</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">My Projects</h2>
                </div>
                <p className="text-gray-600">{projects.length} owned</p>
              </div>

              {/* Project Grid */}
              <ProjectGrid 
                projects={projects}
                onCreateProject={createProject}
                onUpdateProject={updateProject}
                onDeleteProject={deleteProject}
              />
            </div>
          </div>
        </main>
      </div>
      
      <FloatingActionButtons />
    </div>
  )
}
