'use client'

import { useState } from 'react'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CheckCircle, Clock, Circle, MoreVertical, User } from 'lucide-react'
import TaskCard from './task-card'
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

interface KanbanBoardProps {
  tasks: Task[]
  onTaskUpdate: (taskId: string, newStatus: string) => void
}

const columns = [
  {
    id: 'todo',
    title: 'To Do',
    icon: Circle,
    color: 'text-gray-500',
    bgColor: 'bg-gray-50'
  },
  {
    id: 'in_progress',
    title: 'In Progress',
    icon: Clock,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50'
  },
  {
    id: 'completed',
    title: 'Completed',
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-50'
  }
]

export default function KanbanBoard({ tasks, onTaskUpdate }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(task => task.id === event.active.id)
    setActiveTask(task || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const taskId = active.id as string
    const newStatus = over.id as string

    // Only update if status actually changed
    const task = tasks.find(t => t.id === taskId)
    if (task && task.status !== newStatus) {
      onTaskUpdate(taskId, newStatus)
    }
  }

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status)
  }

  const getColumnCount = (status: string) => {
    return getTasksByStatus(status).length
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id)
          const count = columnTasks.length

          return (
            <div key={column.id} className="bg-white rounded-lg border border-gray-200">
              {/* Column Header */}
              <div className={`p-4 border-b border-gray-200 ${column.bgColor}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <column.icon className={`h-5 w-5 ${column.color}`} />
                    <h3 className="font-semibold text-gray-900">{column.title}</h3>
                    <span className="bg-white text-gray-600 text-sm px-2 py-1 rounded-full">
                      {count}
                    </span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Task List */}
              <div className="p-4 min-h-[400px]">
                <SortableContext
                  items={columnTasks.map(task => task.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {columnTasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                    
                    {columnTasks.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <column.icon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No tasks</p>
                      </div>
                    )}
                  </div>
                </SortableContext>
              </div>
            </div>
          )
        })}
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeTask ? (
          <div className="opacity-90">
            <TaskCard task={activeTask} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
