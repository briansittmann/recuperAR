import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getOrders } from '../../api/orders.js'
import { useAuthAdmin } from '../../context/AuthAdminContext.jsx'
import { formatPrice } from '../../utils/formatPrice.js'
import Loader from '../../components/common/Loader.jsx'
import '../../styles/admin-dashboard.css'

const STATUS_LABELS = {
  pending: 'Pendiente',
  paid: 'Pagado',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
}

const PAYMENT_LABELS = {
  transfer: 'Transferencia',
  mercadopago: 'MercadoPago',
}

const initials = (str = '') =>
  str.trim().split(/\s+/).slice(0, 2).map(s => s[0]?.toUpperCase()).join('') || '?'

export default function Dashboard() {
  const { token } = useAuthAdmin()
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrders(token).then(res => {
      if (res.success) setOrders(res.data)
      setLoading(false)
    })
  }, [token])

  if (loading) return <Loader />

  const revenue = orders
    .filter(o => ['paid', 'shipped', 'delivered'].includes(o.status))
    .reduce((sum, o) => sum + parseFloat(o.total), 0)

  const pending = orders.filter(o => o.status === 'pending').length
  const shipped = orders.filter(o => o.status === 'shipped').length

  const metrics = [
    {
      icon: 'payments',
      iconClass: 'metric-card__icon--success',
      badge: 'Confirmado',
      badgeClass: 'metric-card__badge--success',
      label: 'Ingresos',
      value: formatPrice(revenue),
    },
    {
      icon: 'shopping_bag',
      iconClass: 'metric-card__icon--primary',
      badge: 'Total',
      badgeClass: 'metric-card__badge--info',
      label: 'Órdenes',
      value: orders.length,
    },
    {
      icon: 'pending_actions',
      iconClass: 'metric-card__icon--warning',
      badge: pending > 0 ? 'Atención' : 'OK',
      badgeClass: 'metric-card__badge--warning',
      label: 'Pendientes de pago',
      value: pending,
    },
    {
      icon: 'local_shipping',
      iconClass: 'metric-card__icon--info',
      badge: 'En tránsito',
      badgeClass: 'metric-card__badge--info',
      label: 'Enviadas',
      value: shipped,
    },
  ]

  const recent = orders.slice(0, 10)

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-header__title">Dashboard</h1>
        <p className="admin-page-header__subtitle">
          Resumen general de tu tienda en tiempo real.
        </p>
      </div>

      <div className="admin-metrics">
        {metrics.map((m, i) => (
          <div key={i} className="metric-card">
            <div className="metric-card__head">
              <div className={`metric-card__icon ${m.iconClass}`}>
                <span className="material-symbols-outlined">{m.icon}</span>
              </div>
              <span className={`metric-card__badge ${m.badgeClass}`}>{m.badge}</span>
            </div>
            <p className="metric-card__label">{m.label}</p>
            <p className="metric-card__value">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-card__head">
          <h2 className="admin-card__title">Últimas órdenes</h2>
          <Link to="/admin/ordenes" className="admin-card__link">
            Ver todas
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="admin-empty">
            <span className="material-symbols-outlined">inbox</span>
            <p>Todavía no hay órdenes.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Orden</th>
                  <th>Cliente</th>
                  <th>Pago</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(o => (
                  <tr key={o.id}>
                    <td className="admin-table__id">#{o.id}</td>
                    <td>
                      <div className="admin-table__customer">
                        <div className="admin-table__avatar">{initials(o.name || o.email)}</div>
                        <div className="admin-table__customer-info">
                          <div className="admin-table__customer-name">{o.name || '—'}</div>
                          <div className="admin-table__customer-email">{o.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{PAYMENT_LABELS[o.payment_method] ?? o.payment_method}</td>
                    <td className="admin-table__amount">{formatPrice(o.total)}</td>
                    <td>
                      <span className={`admin-status admin-status--${o.status}`}>
                        {STATUS_LABELS[o.status] ?? o.status}
                      </span>
                    </td>
                    <td className="admin-table__date">
                      {new Date(o.created_at).toLocaleDateString('es-AR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
