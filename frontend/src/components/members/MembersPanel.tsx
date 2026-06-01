import { useState } from 'react'
import { Project, ProjectRole, User } from '../../types'
import { projectsApi, usersApi } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { Crown, Shield, User2, UserMinus } from 'lucide-react'

interface Props { project: Project; onRefresh: () => void }

const ROLE_LABELS: Record<ProjectRole, string> = {
  OWNER: 'Owner',
  LEADER: 'Leader',
  SUB_LEADER: 'Sub-leader',
  MEMBER: 'Member',
}

const ROLE_ICONS: Record<ProjectRole, JSX.Element> = {
  OWNER:      <Crown size={14} className="text-yellow-500" />,
  LEADER:     <Shield size={14} className="text-blue-500" />,
  SUB_LEADER: <Shield size={14} className="text-indigo-400" />,
  MEMBER:     <User2 size={14} className="text-gray-400" />,
}

export default function MembersPanel({ project, onRefresh }: Props) {
  const { user: me } = useAuth()
  const isOwner = project.owner.id === me?.id

  const [search, setSearch] = useState('')
  const [results, setResults] = useState<User[]>([])
  const [adding, setAdding] = useState(false)

  const handleSearch = async (q: string) => {
    setSearch(q)
    if (q.length < 2) { setResults([]); return }
    const res = await usersApi.search(q)
    setResults(res.data)
  }

  const addMember = async (user: User, role: ProjectRole = 'MEMBER') => {
    setAdding(true)
    try {
      await projectsApi.addMember(project.id, { userId: user.id, role })
      onRefresh()
      setSearch('')
      setResults([])
    } finally {
      setAdding(false)
    }
  }

  const changeRole = async (userId: number, role: ProjectRole, reportsToUserId?: number) => {
    await projectsApi.addMember(project.id, { userId, role, reportsToUserId })
    onRefresh()
  }

  const removeMember = async (userId: number) => {
    if (!confirm('Remove this member?')) return
    await projectsApi.removeMember(project.id, userId)
    onRefresh()
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-700">Members</h3>

      <div className="space-y-2">
        {project.members.map((m) => (
          <div key={m.userId} className="flex items-center justify-between bg-white border border-gray-100 rounded-lg px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-semibold">
                {(m.displayName || m.username)[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{m.displayName || m.username}</p>
                {m.reportsToName && (
                  <p className="text-xs text-gray-400">reports to {m.reportsToName}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                {ROLE_ICONS[m.role]}
                {isOwner && m.role !== 'OWNER' ? (
                  <select
                    value={m.role}
                    onChange={(e) => changeRole(m.userId, e.target.value as ProjectRole)}
                    className="text-xs border-none bg-transparent cursor-pointer focus:outline-none"
                  >
                    {(['LEADER', 'SUB_LEADER', 'MEMBER'] as ProjectRole[]).map((r) => (
                      <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                    ))}
                  </select>
                ) : (
                  <span>{ROLE_LABELS[m.role]}</span>
                )}
              </div>

              {isOwner && m.role !== 'OWNER' && (
                <button onClick={() => removeMember(m.userId)}>
                  <UserMinus size={14} className="text-gray-300 hover:text-red-400 transition" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {isOwner && (
        <div className="mt-4">
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Add member by username or email…"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {results.length > 0 && (
            <div className="border border-gray-200 rounded-lg mt-1 divide-y max-h-40 overflow-y-auto">
              {results.map((u) => (
                <button
                  key={u.id}
                  disabled={adding}
                  onClick={() => addMember(u)}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center justify-between"
                >
                  <span className="font-medium">{u.displayName || u.username}</span>
                  <span className="text-xs text-gray-400">{u.email}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
