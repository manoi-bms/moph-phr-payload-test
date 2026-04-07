import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { HistoryProvider, useHistory } from '../../context/HistoryContext'

function wrapper({ children }) {
  return <HistoryProvider>{children}</HistoryProvider>
}

describe('HistoryContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts with empty history', () => {
    const { result } = renderHook(() => useHistory(), { wrapper })
    expect(result.current.entries).toEqual([])
  })

  it('adds entry to history', () => {
    const { result } = renderHook(() => useHistory(), { wrapper })
    act(() => {
      result.current.addEntry({
        endpointId: 'update-phr-v1',
        endpointName: 'UpdatePHRv1',
        method: 'POST',
        path: '/api/UpdatePHRv1',
        status: 200,
        elapsed: 100,
        requestBody: '{}',
        responseData: { ok: true },
      })
    })
    expect(result.current.entries).toHaveLength(1)
    expect(result.current.entries[0].endpointName).toBe('UpdatePHRv1')
    expect(result.current.entries[0].id).toBeDefined()
    expect(result.current.entries[0].timestamp).toBeDefined()
  })

  it('prepends new entries (newest first)', () => {
    const { result } = renderHook(() => useHistory(), { wrapper })
    act(() => result.current.addEntry({ endpointName: 'First', status: 200 }))
    act(() => result.current.addEntry({ endpointName: 'Second', status: 200 }))
    expect(result.current.entries[0].endpointName).toBe('Second')
    expect(result.current.entries[1].endpointName).toBe('First')
  })

  it('limits to 50 entries', () => {
    const { result } = renderHook(() => useHistory(), { wrapper })
    for (let i = 0; i < 55; i++) {
      act(() => result.current.addEntry({ endpointName: `Entry ${i}`, status: 200 }))
    }
    expect(result.current.entries).toHaveLength(50)
  })

  it('persists to localStorage', () => {
    const { result } = renderHook(() => useHistory(), { wrapper })
    act(() => result.current.addEntry({ endpointName: 'Persisted', status: 200 }))
    const stored = JSON.parse(localStorage.getItem('phr_history'))
    expect(stored).toHaveLength(1)
    expect(stored[0].endpointName).toBe('Persisted')
  })

  it('clears history', () => {
    const { result } = renderHook(() => useHistory(), { wrapper })
    act(() => result.current.addEntry({ endpointName: 'ToDelete', status: 200 }))
    act(() => result.current.clearHistory())
    expect(result.current.entries).toEqual([])
    expect(localStorage.getItem('phr_history')).toBeNull()
  })

  it('throws when used outside provider', () => {
    expect(() => renderHook(() => useHistory())).toThrow('useHistory must be used within HistoryProvider')
  })
})
