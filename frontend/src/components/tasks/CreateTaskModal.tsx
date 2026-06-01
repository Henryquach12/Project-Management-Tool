import { useForm } from 'react-hook-form'
import { tasksApi, usersApi } from '../../services/api'
import { User } from '../../types'
import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface Props { projectId: number; onClose: () => void; onCreated: () => void }
interface FormData { title: string; description: string; dueDate: string }

export default function CreateTaskModal({ projectId, onClose, onCreated }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
  const [assigneeSearch, setAssigneeSearch] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [selectedAssignees, setSelectedAssignees] = useState<User[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (assigneeSearch.length < 2) { setSearchResults([]); return }
    const t = setTimeout(async () => {
      const res = await usersApi.search(assigneeSearch)
      setSearchResults(res.data)
    }, 300)
    return () => clearTimeout(t)
  }, [assigneeSearch])

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      await tasksApi.create(projectId, {
        ...data,
        dueDate: data.dueDate || undefined,
        assigneeIds: selectedAssignees.map((u) => u.id),
      })
      onCreated()
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const toggleAssignee = (user: User) => {
    setSelectedAssignees((prev) =>
      prev.find((u) => u.id === user.id) ? prev.filter((u) => u.id !== user.id) : [...prev, user]
    )
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">New task</h2>
          <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              {...register('title', { required: 'Title is required' })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due date</label>
            <input
              type="date"
              {...register('dueDate')}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assign to</label>
            <input
              value={assigneeSearch}
              onChange={(e) => setAssigneeSearch(e.target.value)}
              placeholder="Search by username or email…"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {searchResults.length > 0 && (
              <div className="border border-gray-200 rounded-lg mt-1 divide-y max-h-40 overflow-y-auto">
                {searchResults.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => toggleAssignee(u)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${
                      selectedAssignees.find((a) => a.id === u.id) ? 'bg-primary-50 text-primary-700' : ''
                    }`}
                  >
                    <span>{u.displayName || u.username}</span>
                    <span className="text-xs text-gray-400">{u.email}</span>
                  </button>
                ))}
              </div>
            )}
            {selectedAssignees.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedAssignees.map((u) => (
                  <span key={u.id} className="bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    {u.displayName || u.username}
                    <button type="button" onClick={() => toggleAssignee(u)}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-300 rounded-lg py-2.5 text-sm hover:bg-gray-50 transition">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white rounded-lg py-2.5 text-sm font-medium transition disabled:opacity-50"
            >
              {loading ? 'Creating…' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
