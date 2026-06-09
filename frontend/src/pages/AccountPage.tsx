import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { usersApi } from '../services/api'
import Sidebar from '../components/layout/Sidebar'
import { Camera, User, AtSign, Mail, Briefcase, FileText, Tag, Save, X, Pencil } from 'lucide-react'

export default function AccountPage() {
  const { user, updateUser } = useAuth()

  const initials = (user?.displayName || user?.username || '?')
    .split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    displayName: user?.displayName || '',
    bio: user?.bio || '',
    interests: user?.interests || '',
    usualRole: user?.usualRole || '',
    photoUrl: user?.photoUrl || '',
  })

  const [photoPreview, setPhotoPreview] = useState(user?.photoUrl || '')

  function startEdit() {
    setForm({
      displayName: user?.displayName || '',
      bio: user?.bio || '',
      interests: user?.interests || '',
      usualRole: user?.usualRole || '',
      photoUrl: user?.photoUrl || '',
    })
    setPhotoPreview(user?.photoUrl || '')
    setError(null)
    setSuccess(false)
    setEditing(true)
  }

  function cancelEdit() {
    setEditing(false)
    setError(null)
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const res = await usersApi.updateMe({
        displayName: form.displayName || undefined,
        bio: form.bio,
        interests: form.interests,
        usualRole: form.usualRole,
        photoUrl: form.photoUrl,
      })
      updateUser(res.data)
      setSuccess(true)
      setEditing(false)
    } catch {
      setError('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="ml-60 flex-1 p-8 max-w-3xl">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your profile and personal details</p>
        </div>

        {/* Profile photo + name hero */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-5">
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {(editing ? photoPreview : user?.photoUrl) ? (
                <img
                  src={editing ? photoPreview : user?.photoUrl}
                  alt="profile"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-gray-200"
                  onError={() => setPhotoPreview('')}
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-2xl font-bold text-white">
                  {initials}
                </div>
              )}
              {editing && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                  <Camera size={12} className="text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-gray-900 truncate">
                {user?.displayName || user?.username}
              </h2>
              <p className="text-sm text-gray-400">@{user?.username}</p>
              {user?.usualRole && (
                <span className="inline-block mt-1.5 text-xs bg-primary-50 text-primary-700 px-2.5 py-0.5 rounded-full font-medium">
                  {user.usualRole}
                </span>
              )}
            </div>

            {!editing && (
              <button
                onClick={startEdit}
                className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium border border-primary-200 hover:border-primary-300 px-3 py-1.5 rounded-lg transition"
              >
                <Pencil size={14} />
                Edit profile
              </button>
            )}
          </div>

          {/* Photo URL field (only in edit mode) */}
          {editing && (
            <div className="mt-5 pt-5 border-t border-gray-100">
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
                <Camera size={12} className="inline mr-1" />
                Profile photo URL
              </label>
              <input
                type="url"
                value={form.photoUrl}
                onChange={(e) => {
                  setForm({ ...form, photoUrl: e.target.value })
                  setPhotoPreview(e.target.value)
                }}
                placeholder="https://example.com/your-photo.jpg"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400"
              />
              <p className="text-xs text-gray-400 mt-1">Paste a direct image URL. It will preview on the left.</p>
            </div>
          )}
        </div>

        {/* Details form */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-5">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Personal details</h3>
          </div>

          <div className="p-6 space-y-5">
            {/* Display name */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                <User size={12} />
                Display name
              </label>
              {editing ? (
                <input
                  type="text"
                  value={form.displayName}
                  onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                  placeholder="Your full name"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400"
                />
              ) : (
                <p className="text-sm text-gray-800">{user?.displayName || <span className="text-gray-400 italic">Not set</span>}</p>
              )}
            </div>

            {/* Email (read-only always) */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                <Mail size={12} />
                Email address
              </label>
              <p className="text-sm text-gray-800">{user?.email}</p>
            </div>

            {/* Username (read-only) */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                <AtSign size={12} />
                Username
              </label>
              <p className="text-sm text-gray-600 font-mono">@{user?.username}</p>
            </div>

            {/* Usual role */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                <Briefcase size={12} />
                Usual role
              </label>
              {editing ? (
                <input
                  type="text"
                  value={form.usualRole}
                  onChange={(e) => setForm({ ...form, usualRole: e.target.value })}
                  placeholder="e.g. Frontend Developer, Designer, PM..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400"
                />
              ) : (
                <p className="text-sm text-gray-800">
                  {user?.usualRole || <span className="text-gray-400 italic">Not set</span>}
                </p>
              )}
            </div>

            {/* Bio / description */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                <FileText size={12} />
                Bio / description
              </label>
              {editing ? (
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Tell your team a little about yourself..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 resize-none"
                />
              ) : (
                <p className="text-sm text-gray-800 whitespace-pre-wrap">
                  {user?.bio || <span className="text-gray-400 italic">Not set</span>}
                </p>
              )}
            </div>

            {/* Interests */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                <Tag size={12} />
                Interests
              </label>
              {editing ? (
                <input
                  type="text"
                  value={form.interests}
                  onChange={(e) => setForm({ ...form, interests: e.target.value })}
                  placeholder="e.g. React, TypeScript, UX design, open source..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400"
                />
              ) : (
                <p className="text-sm text-gray-800">
                  {user?.interests || <span className="text-gray-400 italic">Not set</span>}
                </p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          {editing && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <div>
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={cancelEdit}
                  disabled={saving}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-300 px-4 py-2 rounded-lg transition disabled:opacity-50"
                >
                  <X size={14} />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1.5 text-sm text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-lg font-medium transition disabled:opacity-60"
                >
                  <Save size={14} />
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </div>
          )}
        </div>

        {success && !editing && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl">
            Profile updated successfully.
          </div>
        )}

      </main>
    </div>
  )
}
