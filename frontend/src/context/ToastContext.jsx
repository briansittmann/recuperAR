import { createContext, useContext, useState, useCallback } from 'react'
import '../styles/toast.css'

const ToastContext = createContext(null)
let nextId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = ++nextId
    setToasts(prev => [...prev, { id, message, type }])
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, duration)
    }
    return id
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, dismiss }}>
      {children}
      {toasts.length > 0 && (
        <div className="toast-container" role="status" aria-live="polite">
          {toasts.map(t => (
            <Toast key={t.id} {...t} onDismiss={() => dismiss(t.id)} />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  )
}

const ICONS = { success: 'check_circle', error: 'error', info: 'info' }

function Toast({ message, type, onDismiss }) {
  return (
    <div className={`toast toast--${type}`}>
      <span className="material-symbols-outlined toast__icon">{ICONS[type] ?? 'info'}</span>
      <span className="toast__message">{message}</span>
      <button type="button" className="toast__close" onClick={onDismiss} aria-label="Cerrar">
        <span className="material-symbols-outlined">close</span>
      </button>
    </div>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    // Fallback no-op si se usa fuera del provider (no rompe la app)
    return { showToast: () => {}, dismiss: () => {} }
  }
  return ctx
}
