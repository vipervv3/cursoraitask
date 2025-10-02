'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckCircle, Circle, MoreVertical, User, Calendar } from 'lucide-react'
import { format } from 'date-fns'

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

interface TaskCardProps {
  task: Task
  isDragging?: boolean
}

export default function TaskCard({ task, isDragging = false }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getPriorityText = (priority: string) => {
    if (task.is_ai_generated && priority === 'urgent') {
      return 'urgent (auto)'
    }
    return priority
  }

  const formatDueDate = (dateString?: string) => {
    if (!dateString) return null
    
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Due today'
    if (diffDays === 1) return 'Due tomorrow'
    if (diffDays > 0) return `Due in ${diffDays} days`
    if (diffDays === -1) return 'Due yesterday'
    return `Overdue ${Math.abs(diffDays)} days`
  }

  const isOverdue = task.due_date && new Date(task.due_date) < new Date()

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white border border-gray-200 rounded-lg p-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${
        isDragging || isSortableDragging ? 'opacity-50 shadow-lg' : ''
      } ${isOverdue ? 'border-red-300 bg-red-50' : ''}`}
    >
      {/* Task Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-2 flex-1">
          <div className="mt-1">
            {task.status === 'completed' ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <Circle className="h-4 w-4 text-gray-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
              {task.title}
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              {task.projects.name}
            </p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 p-1">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      {/* Task Description */}
      {task.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Priority Badge */}
      <div className="mb-3">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
          {getPriorityText(task.priority)}
        </span>
      </div>

      {/* Due Date */}
      {task.due_date && (
        <div className="flex items-center text-xs text-gray-500 mb-3">
          <Calendar className="h-3 w-3 mr-1" />
          <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
            {formatDueDate(task.due_date)}
          </span>
        </div>
      )}

      {/* Task Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="h-3 w-3 text-gray-600" />
          </div>
        </div>
        
        {task.is_ai_generated && (
          <div className="flex items-center space-x-1">
            <span className="text-xs text-blue-600 font-medium">AI</span>
          </div>
        )}
      </div>
    </div>
  )
}
