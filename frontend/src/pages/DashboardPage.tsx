import { useQuery, useQueryClient } from '@tanstack/react-query'
import { projectsApi, tasksApi } from '../services/api'
import { Project, Task } from '../types'
import { useState } from 'react'
import Sidebar from '../components/layout/Sidebar'
import CreateProjectModal from '../components/projects/CreateProjectModal'
import { Link } from 'react-router-dom'
import { Calendar, FolderOpen, Plus, Users } from 'lucide-react'

export default function DashboardPage() {
  const qc = useQueryClient()
  const [showCreate, setShowCreate] = useState(false)

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: () => projectsApi.list().then((r) => r.data),
  })

  const { data: myTasks = [] } = useQuery<Task[]>({
    queryKey: ['my-tasks'],
    queryFn: () => tasksApi.myTasks().then((r) => r.data),
  })

  const dueSoon = myTasks.filter((t) => {
    if (!t.dueDate) return false
    const d = new Date(t.dueDate)
    const diff = (d.getTime() - Date.now()) / 86400000
    return diff >= 0 && diff <= 2
  })

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-60 flex-1 p-8 min-h-screen">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500 mt-1">All your projects and tasks</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            <Plus size={18} /> New Project
          </button>
        </div>

        {dueSoon.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
            <p className="text-sm font-semibold text-amber-800 mb-2">Tasks due soon</p>
            <div className="space-y-1">
              {dueSoon.map((t) => (
                <div key={t.id} className="flex items-center gap-2 text-sm text-amber-700">
                  <Calendar size={13} />
                  <span className="font-medium">{t.title}</span>
                  <span className="text-amber-500">· {t.projectName} · due {new Date(t.dueDate!).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Projects ({projects.length})</h2>
          {projects.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
              <FolderOpen size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-400">No projects yet. Create your first one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-5">
              {projects.map((p) => (
                <Link key={p.id} to={`/projects/${p.id}`}>
                  <div className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md hover:border-primary-200 transition cursor-pointer">
                    <h3 className="font-semibold text-gray-800 mb-1 truncate">{p.name}</h3>
                    {p.description && <p className="text-sm text-gray-400 mb-4 line-clamp-2">{p.description}</p>}
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Users size={12} /> {p.members.length}</span>
                      <span className="flex items-center gap-1"><FolderOpen size={12} /> {p.taskCount} tasks</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">My Tasks ({myTasks.length})</h2>
          {myTasks.length === 0 ? (
            <p className="text-gray-400 text-sm">No tasks assigned to you.</p>
          ) : (
            <div className="space-y-2">
              {myTasks.map((t) => (
                <div key={t.id} className="bg-white border border-gray-100 rounded-lg px-5 py-3 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-800">{t.title}</span>
                    <span className="ml-3 text-xs text-gray-400">{t.projectName}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    {t.dueDate && (
                      <span className="text-gray-400 flex items-center gap-1">
                        <Calendar size={11} />
                        {new Date(t.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded-full font-medium ${
                      t.status === 'TODO' ? 'bg-gray-100 text-gray-600' :
                      t.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {t.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {showCreate && (
        <CreateProjectModal
          onClose={() => setShowCreate(false)}
          onCreated={() => qc.invalidateQueries({ queryKey: ['projects'] })}
        />
      )}
    </div>
  )
}
