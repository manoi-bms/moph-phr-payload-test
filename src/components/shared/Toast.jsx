import { useState, useEffect, useCallback } from 'react'

const TOAST_STYLES = {
  success: 'bg-green-800 border-green-600 text-green-100',
  error: 'bg-red-800 border-red-600 text-red-100',
  warning: 'bg-yellow-800 border-yellow-600 text-yellow-100',
  info: 'bg-blue-800 border-blue-600 text-blue-100',
}

export function Toast({ message, type = 'info', duration = 3000, onClose }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  return (
    <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg border shadow-lg ${TOAST_STYLES[type]} max-w-sm`}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm">{message}</span>
        <button onClick={onClose} className="text-current opacity-60 hover:opacity-100">&times;</button>
      </div>
    </div>
  )
}

// Hook for managing toasts
export function useToast() {
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    setToast({ message, type, duration, key: Date.now() })
  }, [])

  const hideToast = useCallback(() => setToast(null), [])

  const ToastContainer = toast ? (
    <Toast key={toast.key} message={toast.message} type={toast.type} duration={toast.duration} onClose={hideToast} />
  ) : null

  return { showToast, ToastContainer }
}
