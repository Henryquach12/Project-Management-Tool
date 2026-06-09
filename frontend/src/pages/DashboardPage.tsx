import { useQuery, useQueryClient } from '@tanstack/react-query'
import { projectsApi, tasksApi } from '../services/api'
import { Project, Task } from '../types'
import { useState } from 'react'
import Sidebar from '../components/layout/Sidebar'
import CreateProjectModal from '../components/projects/CreateProjectModal'
import { Link } from 'react-router-dom'
import { Calendar, FolderOpen, Plus, Users, CheckCircle2, Clock, Layers } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const CARD_GRADIENTS = [
  'from-violet-500 to-purple-600',
  'from-blue-500 to-cyan-600',
  'from-emerald-500 to-teal-600',
  'from-orange-400 to-rose-500',
  'from-pink-500 to-rose-600',
  'from-amber-500 to-orange-600',
]

export default function DashboardPage() {
  const qc = useQueryClient()
  const { user } = useAuth()
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
    const diff = (new Date(t.dueDate).getTime() - Date.now()) / 86400000
    return diff >= 0 && diff <= 2
  })
  const inProgress = myTasks.filter((t) => t.status === 'IN_PROGRESS')
  const done = myTasks.filter((t) => t.status === 'DONE')

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="ml-60 flex-1 p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {greeting()}, {user?.displayName?.split(' ')[0] || user?.username} 👋
            </h1>
            <p className="text-gray-500 mt-0.5 text-sm">Here's what's happening with your projects</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg font-medium transition shadow-lg shadow-primary-600/25"
          >
            <Plus size={17} /> New Project
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl p-5 text-white shadow-lg shadow-primary-600/20">
            <div className="flex items-center justify-between mb-3">
              <p className="text-primary-200 text-sm font-medium">Projects</p>
              <Layers size={18} className="text-primary-300" />
            </div>
            <p className="text-3xl font-bold">{projects.length}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-5 text-white shadow-lg shadow-emerald-500/20">
            <div className="flex items-center justify-between mb-3">
              <p className="text-emerald-100 text-sm font-medium">My Tasks</p>
              <CheckCircle2 size={18} className="text-emerald-200" />
            </div>
            <p className="text-3xl font-bold">{myTasks.length}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-400 to-rose-500 rounded-xl p-5 text-white shadow-lg shadow-orange-400/20">
            <div className="flex items-center justify-between mb-3">
              <p className="text-orange-100 text-sm font-medium">Due Soon</p>
              <Clock size={18} className="text-orange-200" />
            </div>
            <p className="text-3xl font-bold">{dueSoon.length}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-5 text-white shadow-lg shadow-blue-500/20">
            <div className="flex items-center justify-between mb-3">
              <p className="text-blue-100 text-sm font-medium">Completed</p>
              <CheckCircle2 size={18} className="text-blue-200" />
            </div>
            <p className="text-3xl font-bold">{done.length}</p>
          </div>
        </div>

        {/* Due soon alert */}
        {dueSoon.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
            <p className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-1.5">
              <Clock size={14} /> Tasks due in the next 48 hours
            </p>
            <div className="space-y-1">
              {dueSoon.map((t) => (
                <div key={t.id} className="flex items-center gap-2 text-sm text-amber-700">
                  <Calendar size={12} />
                  <span className="font-medium">{t.title}</span>
                  <span className="text-amber-500">· {t.projectName} · due {new Date(t.dueDate!).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        <section className="mb-10">
          <h2 className="text-base font-semibold text-gray-700 mb-4">Projects ({projects.length})</h2>
          {projects.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
              <FolderOpen size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-400">No projects yet. Create your first one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((p, i) => (
                <Link key={p.id} to={`/projects/${p.id}`}>
                  <div className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg hover:border-primary-100 transition-all group cursor-pointer">
                    <div className={`h-2 bg-gradient-to-r ${CARD_GRADIENTS[i % CARD_GRADIENTS.length]}`} />
                    <div className="p-5">
                      <h3 className="font-semibold text-gray-800 mb-1 truncate group-hover:text-primary-600 transition">{p.name}</h3>
                      {p.description && <p className="text-sm text-gray-400 mb-4 line-clamp-2">{p.description}</p>}
                      <div className="flex items-center gap-4 text-xs text-gray-400 mt-3">
                        <span className="flex items-center gap-1"><Users size={12} /> {p.members.length} member{p.members.length !== 1 ? 's' : ''}</span>
                        <span className="flex items-center gap-1"><FolderOpen size={12} /> {p.taskCount} task{p.taskCount !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* My Tasks */}
        <section>
          <h2 className="text-base font-semibold text-gray-700 mb-4">My Tasks ({myTasks.length})</h2>
          {myTasks.length === 0 ? (
            <p className="text-gray-400 text-sm">No tasks assigned to you yet.</p>
          ) : (
            <div className="space-y-2">
              {myTasks.map((t) => (
                <div key={t.id} className="bg-white border border-gray-100 rounded-lg px-5 py-3.5 flex items-center justify-between hover:border-primary-100 transition">
                  <div>
                    <span className="text-sm font-medium text-gray-800">{t.title}</span>
                    <span className="ml-3 text-xs text-gray-400 bg-gray-50 rounded px-1.5 py-0.5">{t.projectName}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs flex-shrink-0">
                    {t.dueDate && (
                      <span className="text-gray-400 flex items-center gap-1">
                        <Calendar size={11} />
                        {new Date(t.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    <span className={`px-2.5 py-0.5 rounded-full font-semibold ${
                      t.status === 'TODO'        ? 'bg-gray-100 text-gray-600' :
                      t.status === 'IN_PROGRESS' ? 'bg-primary-100 text-primary-700' :
                      t.status === 'IN_REVIEW'   ? 'bg-amber-100 text-amber-700' :
                                                   'bg-emerald-100 text-emerald-700'
                    }`}>
                      {t.status.replace(/_/g, ' ')}
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
