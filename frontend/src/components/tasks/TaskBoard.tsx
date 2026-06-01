import { useState } from 'react'
import { Task, TaskStatus } from '../../types'
import { tasksApi } from '../../services/api'
import TaskCompletionCelebration from './TaskCompletionCelebration'
import { Calendar, User2 } from 'lucide-react'

interface Props {
  projectId: number
  tasks: Task[]
  onRefresh: () => void
  onCreateTask: () => void
  canManage: boolean
}

const COLUMNS: { status: TaskStatus; label: string; color: string }[] = [
  { status: 'TODO',        label: 'To Do',       color: 'border-gray-300' },
  { status: 'IN_PROGRESS', label: 'In Progress',  color: 'border-blue-400' },
  { status: 'DONE',        label: 'Done',         color: 'border-green-400' },
]

function statusBadge(status: TaskStatus) {
  if (status === 'TODO')        return 'bg-gray-100 text-gray-600'
  if (status === 'IN_PROGRESS') return 'bg-blue-100 text-blue-700'
  return 'bg-green-100 text-green-700'
}

export default function TaskBoard({ projectId, tasks, onRefresh, onCreateTask, canManage }: Props) {
  const [celebration, setCelebration] = useState<Task | null>(null)

  const handleStatusChange = async (task: Task, newStatus: TaskStatus) => {
    await tasksApi.updateStatus(projectId, task.id, newStatus)
    if (newStatus === 'DONE') setCelebration(task)
    onRefresh()
  }

  const handleDelete = async (taskId: number) => {
    if (!confirm('Delete this task?')) return
    await tasksApi.delete(projectId, taskId)
    onRefresh()
  }

  return (
    <>
      {celebration && (
        <TaskCompletionCelebration
          taskTitle={celebration.title}
          onClose={() => setCelebration(null)}
        />
      )}

      <div className="flex gap-5 overflow-x-auto pb-4">
        {COLUMNS.map(({ status, label, color }) => {
          const col = tasks.filter((t) => t.status === status)
          return (
            <div key={status} className={`flex-1 min-w-[280px] bg-gray-50 rounded-xl border-t-4 ${color} p-4`}>
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-gray-700">{label}</span>
                <span className="text-xs bg-gray-200 text-gray-600 rounded-full px-2 py-0.5">{col.length}</span>
              </div>

              <div className="space-y-3">
                {col.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                    canManage={canManage}
                  />
                ))}
              </div>

              {status === 'TODO' && canManage && (
                <button
                  onClick={onCreateTask}
                  className="mt-3 w-full text-sm text-gray-400 hover:text-primary-600 py-2 border-2 border-dashed border-gray-200 hover:border-primary-300 rounded-lg transition"
                >
                  + Add task
                </button>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}

function TaskCard({ task, onStatusChange, onDelete, canManage }: {
  task: Task
  onStatusChange: (t: Task, s: TaskStatus) => void
  onDelete: (id: number) => void
  canManage: boolean
}) {
  const isOverdue = task.dueDate && task.status !== 'DONE' && new Date(task.dueDate) < new Date()

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 group">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-gray-800 leading-snug">{task.title}</p>
        {canManage && (
          <button
            onClick={() => onDelete(task.id)}
            className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition text-xs shrink-0"
          >✕</button>
        )}
      </div>

      {task.description && (
        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{task.description}</p>
      )}

      {task.dueDate && (
        <div className={`flex items-center gap-1 mt-2 text-xs ${isOverdue ? 'text-red-500' : 'text-gray-400'}`}>
          <Calendar size={11} />
          {new Date(task.dueDate).toLocaleDateString()}
          {isOverdue && ' · Overdue'}
        </div>
      )}

      {task.assignees.length > 0 && (
        <div className="flex items-center gap-1 mt-2">
          <User2 size={11} className="text-gray-400" />
          <span className="text-xs text-gray-400">
            {task.assignees.map((a) => a.displayName || a.username).join(', ')}
          </span>
        </div>
      )}

      {canManage && task.status !== 'DONE' && (
        <div className="mt-3 flex gap-2">
          {task.status === 'TODO' && (
            <button
              onClick={() => onStatusChange(task, 'IN_PROGRESS')}
              className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-2 py-1 rounded transition"
            >
              Start
            </button>
          )}
          {task.status === 'IN_PROGRESS' && (
            <button
              onClick={() => onStatusChange(task, 'DONE')}
              className="text-xs bg-green-50 text-green-600 hover:bg-green-100 px-2 py-1 rounded transition"
            >
              Complete
            </button>
          )}
        </div>
      )}
    </div>
  )
}
