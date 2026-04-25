import { useState, useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthAdmin } from '../../context/AuthAdminContext.jsx'
import { ToastProvider } from '../../context/ToastContext.jsx'
import Sidebar from './Sidebar.jsx'
import '../../styles/admin.css'

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuthAdmin()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  useEffect(() => { setSidebarOpen(false) }, [location.pathname])

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />

  return (
    <ToastProvider>
      <div className="admin-layout">
        <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />

        <div
          className={`admin-sidebar__backdrop${sidebarOpen ? ' is-open' : ''}`}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />

        <button
          type="button"
          className="admin-mobile-toggle"
          aria-label="Abrir menú"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </ToastProvider>
  )
}
