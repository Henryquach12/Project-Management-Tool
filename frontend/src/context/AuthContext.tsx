import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '../types'
import { authApi } from '../services/api'

interface AuthContextType {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
  updateUser: (user: User) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>(null!)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading] = useState(false)

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
    sessionStorage.setItem('token', t)
    setToken(t)
    setUser(u)
  }

  const logout = () => {
    sessionStorage.removeItem('token')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  const updateUser = (u: User) => setUser(u)

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
