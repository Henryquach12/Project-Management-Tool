import { useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { projectsApi, tasksApi } from '../services/api'
import { Project, Task } from '../types'
import { useState } from 'react'
import Sidebar from '../components/layout/Sidebar'
import TaskBoard from '../components/tasks/TaskBoard'
import CreateTaskModal from '../components/tasks/CreateTaskModal'
import MembersPanel from '../components/members/MembersPanel'
import { useAuth } from '../context/AuthContext'
import { Users } from 'lucide-react'

type Tab = 'board' | 'members'

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>()
  const projectId = Number(id)
  const qc = useQueryClient()
  const { user: me } = useAuth()
  const [tab, setTab] = useState<Tab>('board')
  const [showCreateTask, setShowCreateTask] = useState(false)

  const { data: project, isLoading: loadingProject } = useQuery<Project>({
    queryKey: ['project', projectId],
    queryFn: () => projectsApi.get(projectId).then((r) => r.data),
  })

  const { data: tasks = [], isLoading: loadingTasks } = useQuery<Task[]>({
    queryKey: ['tasks', projectId],
    queryFn: () => tasksApi.list(projectId).then((r) => r.data),
  })

  const refreshTasks = () => qc.invalidateQueries({ queryKey: ['tasks', projectId] })
  const refreshProject = () => qc.invalidateQueries({ queryKey: ['project', projectId] })

  const myRole = project?.members.find((m) => m.userId === me?.id)?.role
  const canManage = project?.owner.id === me?.id || myRole === 'LEADER' || myRole === 'SUB_LEADER'

  if (loadingProject) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="ml-60 flex-1 p-8 flex items-center justify-center text-gray-400">Loading…</main>
      </div>
    )
  }

  if (!project) return null

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-60 flex-1 p-8 min-h-screen">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{project.name}</h1>
          {project.description && <p className="text-gray-500 mt-1">{project.description}</p>}
        </div>

        <div className="flex items-center gap-1 border-b border-gray-200 mb-6">
          {([
            { key: 'board', label: 'Board' },
            { key: 'members', label: 'Members', icon: <Users size={14} /> },
          ] as { key: Tab; label: string; icon?: JSX.Element }[]).map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition ${
                tab === key ? 'border-primary-600 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {icon}{label}
            </button>
          ))}

          {tab === 'board' && canManage && (
            <button
              onClick={() => setShowCreateTask(true)}
              className="ml-auto mb-2 bg-primary-600 hover:bg-primary-700 text-white text-sm px-4 py-2 rounded-lg font-medium transition"
            >
              + Add task
            </button>
          )}
        </div>

        {tab === 'board' && (
          loadingTasks ? (
            <p className="text-gray-400">Loading tasks…</p>
          ) : (
            <TaskBoard
              projectId={projectId}
              tasks={tasks}
              onRefresh={refreshTasks}
              onCreateTask={() => setShowCreateTask(true)}
              canManage={!!canManage}
            />
          )
        )}

        {tab === 'members' && (
          <MembersPanel project={project} onRefresh={refreshProject} />
        )}
      </main>

      {showCreateTask && (
        <CreateTaskModal
          projectId={projectId}
          onClose={() => setShowCreateTask(false)}
          onCreated={refreshTasks}
        />
      )}
    </div>
  )
}
