import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

const ENVIRONMENTS = {
  uat: { label: 'UAT', proxyBase: '/proxy/uat' },
  prod: { label: 'Production', proxyBase: '/proxy/prod' },
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('phr_token') || '')
  const [authMethod, setAuthMethod] = useState(() => localStorage.getItem('phr_auth_method') || 'none')
  const [env, setEnv] = useState(() => localStorage.getItem('phr_env') || 'uat')

  useEffect(() => {
    localStorage.setItem('phr_token', token)
    localStorage.setItem('phr_auth_method', authMethod)
    localStorage.setItem('phr_env', env)
  }, [token, authMethod, env])

  const proxyBase = ENVIRONMENTS[env].proxyBase
  const authProxyBase = '/proxy/auth'
  const envLabel = ENVIRONMENTS[env].label
  const isAuthenticated = token.length > 0

  const login = useCallback((newToken, method) => {
    setToken(newToken)
    setAuthMethod(method)
  }, [])

  const logout = useCallback(() => {
    setToken('')
    setAuthMethod('none')
  }, [])

  return (
    <AuthContext.Provider value={{
      token, authMethod, env, setEnv,
      proxyBase, authProxyBase, envLabel,
      isAuthenticated, login, logout,
      environments: ENVIRONMENTS,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
