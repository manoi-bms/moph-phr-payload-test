import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { EndpointProvider, useEndpoint } from '../../context/EndpointContext'

function wrapper({ children }) {
  return <EndpointProvider>{children}</EndpointProvider>
}

describe('EndpointContext', () => {
  it('has null initial endpoint', () => {
    const { result } = renderHook(() => useEndpoint(), { wrapper })
    expect(result.current.selectedEndpoint).toBeNull()
    expect(result.current.requestBody).toBe('')
  })

  it('selectEndpoint sets endpoint and loads template', () => {
    const { result } = renderHook(() => useEndpoint(), { wrapper })
    act(() => result.current.selectEndpoint('update-phr-v1'))
    expect(result.current.selectedEndpoint).not.toBeNull()
    expect(result.current.selectedEndpoint.id).toBe('update-phr-v1')
    expect(result.current.requestBody).toContain('managingOrganization')
  })

  it('setRequestBody updates body', () => {
    const { result } = renderHook(() => useEndpoint(), { wrapper })
    act(() => result.current.setRequestBody('{"test": true}'))
    expect(result.current.requestBody).toBe('{"test": true}')
  })

  it('resetTemplate restores original template', () => {
    const { result } = renderHook(() => useEndpoint(), { wrapper })
    act(() => result.current.selectEndpoint('update-phr-v1'))
    const original = result.current.requestBody
    act(() => result.current.setRequestBody('modified'))
    expect(result.current.requestBody).toBe('modified')
    act(() => result.current.resetTemplate())
    expect(result.current.requestBody).toBe(original)
  })

  it('selectEndpoint ignores unknown id', () => {
    const { result } = renderHook(() => useEndpoint(), { wrapper })
    act(() => result.current.selectEndpoint('nonexistent'))
    expect(result.current.selectedEndpoint).toBeNull()
  })

  it('throws when used outside provider', () => {
    expect(() => renderHook(() => useEndpoint())).toThrow('useEndpoint must be used within EndpointProvider')
  })
})
