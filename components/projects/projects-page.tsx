'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/layout/sidebar'
import FloatingActionButtons from '@/components/layout/floating-action-buttons'
import ProjectGrid from '@/components/projects/project-grid'
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
  const [user, setUser] = useState<any>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get demo user from localStorage
    const demoUser = localStorage.getItem('demo-user')
    if (demoUser) {
      setUser(JSON.parse(demoUser))
      loadProjects()
    }
    setLoading(false)
  }, [])

  const loadProjects = async () => {
    try {
      setLoading(true)
      
      // Demo data for testing
      const demoProjects = [
        {
          id: '1',
          name: 'Copilot Integration',
          description: 'Integrate Microsoft Copilot with our existing workflow to enhance productivity and automate routine tasks',
          status: 'active',
          progress: 0,
          budget_allocated: 50000,
          budget_spent: 12500,
          start_date: '2024-01-01',
          due_date: '2024-01-15',
          created_at: '2024-01-01T10:00:00Z',
          updated_at: '2024-01-01T10:00:00Z'
        },
        {
          id: '2',
          name: 'Dataverse Setup',
          description: 'Set up Microsoft Dataverse environment for data management and integration across applications',
          status: 'active',
          progress: 25,
          budget_allocated: 75000,
          budget_spent: 18750,
          start_date: '2024-01-02',
          due_date: '2024-01-20',
          created_at: '2024-01-02T11:00:00Z',
          updated_at: '2024-01-02T11:00:00Z'
        },
        {
          id: '3',
          name: 'FO Summit Planning',
          description: 'Plan and organize the annual Field Operations Summit including logistics, speakers, and activities',
          status: 'active',
          progress: 30,
          budget_allocated: 100000,
          budget_spent: 30000,
          start_date: '2024-01-03',
          due_date: '2024-01-25',
          created_at: '2024-01-03T12:00:00Z',
          updated_at: '2024-01-03T12:00:00Z'
        },
        {
          id: '4',
          name: 'AI Analytics Dashboard',
          description: 'Build an intelligent analytics dashboard with AI-powered insights and predictive analytics',
          status: 'planning',
          progress: 5,
          budget_allocated: 60000,
          budget_spent: 3000,
          start_date: '2024-01-10',
          due_date: '2024-02-15',
          created_at: '2024-01-10T09:00:00Z',
          updated_at: '2024-01-10T09:00:00Z'
        },
        {
          id: '5',
          name: 'Mobile App Development',
          description: 'Develop a mobile application for field operations with offline capabilities and real-time sync',
          status: 'completed',
          progress: 100,
          budget_allocated: 120000,
          budget_spent: 115000,
          start_date: '2023-11-01',
          due_date: '2023-12-31',
          created_at: '2023-11-01T08:00:00Z',
          updated_at: '2023-12-31T17:00:00Z'
        }
      ]

      setProjects(demoProjects)
    } catch (error) {
      console.error('Error loading projects:', error)
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (projectData: Partial<Project>) => {
    try {
      const newProject = {
        id: Date.now().toString(),
        ...projectData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as Project

      setProjects(prev => [newProject, ...prev])
      toast.success('Project created successfully')
      return newProject
    } catch (error) {
      console.error('Error creating project:', error)
      toast.error('Failed to create project')
      throw error
    }
  }

  const updateProject = async (projectId: string, updates: Partial<Project>) => {
    try {
      setProjects(prev => prev.map(project => 
        project.id === projectId 
          ? { ...project, ...updates, updated_at: new Date().toISOString() }
          : project
      ))
      toast.success('Project updated successfully')
    } catch (error) {
      console.error('Error updating project:', error)
      toast.error('Failed to update project')
    }
  }

  const deleteProject = async (projectId: string) => {
    try {
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
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
                    <p className="mt-2 text-gray-600">Manage your projects with AI-powered insights and smart recommendations</p>
                  </div>
                  <button 
                    onClick={() => {/* TODO: Open create project modal */}}
                    className="btn btn-primary"
                  >
                    + New Project
                  </button>
                </div>
              </div>

              {/* Project Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="card">
                  <div className="card-content">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Projects</p>
                        <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
                      </div>
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm">📁</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-content">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Active Projects</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {projects.filter(p => p.status === 'active').length}
                        </p>
                      </div>
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm">🚀</span>
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
                          {projects.filter(p => p.status === 'completed').length}
                        </p>
                      </div>
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 text-sm">✅</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-content">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Budget</p>
                        <p className="text-2xl font-bold text-gray-900">
                          ${projects.reduce((sum, p) => sum + p.budget_allocated, 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-yellow-600 text-sm">💰</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Insights Banner */}
              <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">🤖</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Project Insights</h3>
                    <p className="text-gray-700 mb-3">
                      Based on your project data, AI recommends focusing on "Copilot Integration" as it has the highest impact potential and is approaching its deadline.
                    </p>
                    <div className="flex space-x-4">
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                        View AI Recommendations →
                      </button>
                      <button className="text-gray-600 hover:text-gray-700 font-medium text-sm">
                        Schedule Review
                      </button>
                    </div>
                  </div>
                </div>
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
