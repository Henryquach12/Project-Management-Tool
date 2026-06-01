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
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('token')
    if (stored) {
      authApi.me()
        .then((res) => { setUser(res.data); setToken(stored) })
        .catch(() => { localStorage.removeItem('token'); setToken(null) })
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
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
    setToken(t)
    setUser(u)
  }

  const logout = () => {
    localStorage.removeItem('token')
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
