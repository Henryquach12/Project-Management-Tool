import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '../types'
import { authApi } from '../services/api'

interface AuthContextType {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>(null!)

export function AuthProvider({ children }: { children: ReactNode }) {
  const storedUser = localStorage.getItem('user')
  const [user, setUser] = useState<User | null>(storedUser ? JSON.parse(storedUser) : null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [isLoading] = useState(false)

  // Background token validation — never blocks the UI
  useEffect(() => {
    const stored = localStorage.getItem('token')
    if (!stored) return
    authApi.me()
      .then((res) => {
        setUser(res.data)
        localStorage.setItem('user', JSON.stringify(res.data))
      })
      .catch(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setToken(null)
        setUser(null)
      })
  }, [])

  // Handle OAuth2 redirect: /oauth2/callback?token=xxx
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const oauthToken = params.get('token')
    if (oauthToken && window.location.pathname === '/oauth2/callback') {
      localStorage.setItem('token', oauthToken)
      setToken(oauthToken)
      authApi.me().then((res) => {
        setUser(res.data)
        window.history.replaceState({}, '', '/dashboard')
      })
    }
  }, [])

  const login = (t: string, u: User) => {
    localStorage.setItem('token', t)
    localStorage.setItem('user', JSON.stringify(u))
    setToken(t)
    setUser(u)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
