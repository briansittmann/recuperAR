import { NavLink } from 'react-router-dom'
import { useAuthAdmin } from '../../context/AuthAdminContext.jsx'
import favicon from '../../assets/favicon.png'

const links = [
  { to: '/admin/dashboard',  label: 'Dashboard',  icon: 'dashboard' },
  { to: '/admin/productos',  label: 'Productos',  icon: 'inventory_2' },
  { to: '/admin/categorias', label: 'Categorías', icon: 'category' },
  { to: '/admin/ordenes',    label: 'Órdenes',    icon: 'shopping_cart' },
]

export default function Sidebar({ open = false, onNavigate }) {
  const { logoutAdmin } = useAuthAdmin()

  return (
    <aside className={`admin-sidebar${open ? ' is-open' : ''}`}>
      <div className="admin-sidebar__brand">
        <img src={favicon} alt="RecuperAR" className="admin-sidebar__brand-logo" />
        <div>
          <div className="admin-sidebar__brand-name">RecuperAR</div>
          <div className="admin-sidebar__brand-sub">Admin Panel</div>
        </div>
      </div>

      <nav className="admin-sidebar__nav">
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            onClick={onNavigate}
            className={({ isActive }) => `admin-sidebar__link${isActive ? ' admin-sidebar__link--active' : ''}`}
          >
            <span className="material-symbols-outlined">{l.icon}</span>
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>

      <button type="button" onClick={logoutAdmin} className="admin-sidebar__logout">
        <span className="material-symbols-outlined">logout</span>
        Cerrar sesión
      </button>
    </aside>
  )
}
