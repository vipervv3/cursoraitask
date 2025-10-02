'use client'

import { FolderOpen, Clock, CheckCircle, Users } from 'lucide-react'

interface MetricsCardsProps {
  data: {
    totalProjects: number
    activeTasks: number
    completedTasks: number
    teamMembers: number
  }
}

export default function MetricsCards({ data }: MetricsCardsProps) {
  const metrics = [
    {
      title: 'Total Projects',
      value: data.totalProjects,
      icon: FolderOpen,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Active Tasks',
      value: data.activeTasks,
      icon: Clock,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      title: 'Completed Tasks',
      value: data.completedTasks,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Team Members',
      value: data.teamMembers,
      icon: Users,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <div key={index} className="card animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
              </div>
              <div className={`p-3 rounded-full ${metric.bgColor}`}>
                <metric.icon className={`h-6 w-6 ${metric.textColor}`} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
