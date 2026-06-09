import { useAuth } from '../context/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { projectsApi, tasksApi } from '../services/api'
import { Project, Task } from '../types'
import Sidebar from '../components/layout/Sidebar'
import { Mail, User, AtSign, Layers, CheckCircle2, Clock, LogOut } from 'lucide-react'

export default function AccountPage() {
  const { user, logout } = useAuth()

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: () => projectsApi.list().then((r) => r.data),
  })

  const { data: myTasks = [] } = useQuery<Task[]>({
    queryKey: ['my-tasks'],
    queryFn: () => tasksApi.myTasks().then((r) => r.data),
  })

  const done       = myTasks.filter((t) => t.status === 'DONE').length
  const inProgress = myTasks.filter((t) => t.status === 'IN_PROGRESS').length

  const initials = (user?.displayName || user?.username || '?')
    .split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)

  const ownedProjects = projects.filter((p) => p.owner?.id === user?.id)

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="ml-60 flex-1 p-8">

        {/* Profile hero */}
        <div className="relative bg-gradient-to-r from-primary-600 via-primary-700 to-violet-800 rounded-2xl p-8 mb-6 overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #fff 0%, transparent 60%)' }} />
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/5 rounded-full" />
          <div className="absolute -right-4 -bottom-12 w-32 h-32 bg-white/5 rounded-full" />

          <div className="relative flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-3xl font-bold text-white flex-shrink-0">
              {initials}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white leading-tight">
                {user?.displayName || user?.username}
              </h1>
              <p className="text-primary-200 text-sm mt-0.5">@{user?.username}</p>
              <p className="text-primary-300 text-sm">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
              <Layers size={18} className="text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
              <p className="text-xs text-gray-400">Total projects</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
              <Layers size={18} className="text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{ownedProjects.length}</p>
              <p className="text-xs text-gray-400">Owned by you</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 size={18} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{done}</p>
              <p className="text-xs text-gray-400">Tasks completed</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Clock size={18} className="text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{inProgress}</p>
              <p className="text-xs text-gray-400">In progress</p>
            </div>
          </div>
        </div>

        {/* Account details card */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Account details</h2>
          </div>
          <div className="divide-y divide-gray-50">
            <div className="px-6 py-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-primary-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Display name</p>
                <p className="text-sm font-medium text-gray-800">{user?.displayName || '—'}</p>
              </div>
            </div>
            <div className="px-6 py-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                <AtSign size={16} className="text-violet-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Username</p>
                <p className="text-sm font-medium text-gray-800">@{user?.username}</p>
              </div>
            </div>
            <div className="px-6 py-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Mail size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Email address</p>
                <p className="text-sm font-medium text-gray-800">{user?.email}</p>
              </div>
            </div>
            <div className="px-6 py-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                <span className="text-gray-500 text-xs font-bold">ID</span>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">User ID</p>
                <p className="text-sm font-mono text-gray-600">#{user?.id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium transition"
        >
          <LogOut size={16} />
          Sign out of ProjectFlow
        </button>

      </main>
    </div>
  )
}
