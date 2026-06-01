import { useForm } from 'react-hook-form'
import { projectsApi } from '../../services/api'
import { useState } from 'react'
import { X } from 'lucide-react'

interface Props { onClose: () => void; onCreated: () => void }
interface FormData { name: string; description: string }

export default function CreateProjectModal({ onClose, onCreated }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      await projectsApi.create(data)
      onCreated()
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">New project</h2>
          <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project name</label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-300 rounded-lg py-2.5 text-sm hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white rounded-lg py-2.5 text-sm font-medium transition disabled:opacity-50">
              {loading ? 'Creating…' : 'Create project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
