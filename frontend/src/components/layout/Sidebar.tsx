import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, FolderKanban, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const links = [
    { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  ]

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <FolderKanban className="text-primary-600" size={22} />
          <span className="font-bold text-gray-800">ProjectFlow</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
              location.pathname === l.to
                ? 'bg-primary-50 text-primary-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {l.icon}
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-gray-100 px-4 py-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-semibold">
            {(user?.displayName || user?.username || '?')[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{user?.displayName || user?.username}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition w-full"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
