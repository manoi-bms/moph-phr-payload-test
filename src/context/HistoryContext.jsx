import { createContext, useContext, useState, useCallback } from 'react'

const HistoryContext = createContext(null)

const MAX_ENTRIES = 50
const STORAGE_KEY = 'phr_history'

function loadHistory() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveHistory(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

export function HistoryProvider({ children }) {
  const [entries, setEntries] = useState(loadHistory)

  const addEntry = useCallback((entry) => {
    setEntries(prev => {
      const newEntries = [
        {
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
          timestamp: new Date().toISOString(),
          ...entry,
        },
        ...prev,
      ].slice(0, MAX_ENTRIES)
      saveHistory(newEntries)
      return newEntries
    })
  }, [])

  const clearHistory = useCallback(() => {
    setEntries([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return (
    <HistoryContext.Provider value={{ entries, addEntry, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  )
}

export const useHistory = () => {
  const ctx = useContext(HistoryContext)
  if (!ctx) throw new Error('useHistory must be used within HistoryProvider')
  return ctx
}
