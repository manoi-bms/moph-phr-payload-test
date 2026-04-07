import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '../../context/AuthContext'

function wrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('has correct initial state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.token).toBe('')
    expect(result.current.authMethod).toBe('none')
    expect(result.current.env).toBe('uat')
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.proxyBase).toBe('/proxy/uat')
    expect(result.current.envLabel).toBe('UAT')
  })

  it('login sets token and method', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    act(() => result.current.login('test-token', 'jwt'))
    expect(result.current.token).toBe('test-token')
    expect(result.current.authMethod).toBe('jwt')
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('logout clears token', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    act(() => result.current.login('test-token', 'jwt'))
    act(() => result.current.logout())
    expect(result.current.token).toBe('')
    expect(result.current.authMethod).toBe('none')
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('setEnv switches environment', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    act(() => result.current.setEnv('prod'))
    expect(result.current.env).toBe('prod')
    expect(result.current.proxyBase).toBe('/proxy/prod')
    expect(result.current.envLabel).toBe('Production')
  })

  it('persists to localStorage', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    act(() => result.current.login('saved-token', 'fixed'))
    expect(localStorage.getItem('phr_token')).toBe('saved-token')
    expect(localStorage.getItem('phr_auth_method')).toBe('fixed')
  })

  it('throws when used outside provider', () => {
    expect(() => {
      renderHook(() => useAuth())
    }).toThrow('useAuth must be used within AuthProvider')
  })
})
