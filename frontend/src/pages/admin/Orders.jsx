import { useEffect, useMemo, useState } from 'react'
import { getOrders, updateOrderStatus } from '../../api/orders.js'
import { useAuthAdmin } from '../../context/AuthAdminContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { formatPrice } from '../../utils/formatPrice.js'
import Loader from '../../components/common/Loader.jsx'
import '../../styles/admin-products.css'
import '../../styles/admin-dashboard.css'

const STATUS_LABELS = {
  pending:   'Pendiente',
  paid:      'Pagado',
  shipped:   'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
}

const PAYMENT_LABELS = {
  transfer:    'Transferencia',
  mercadopago: 'MercadoPago',
}

const initials = (str = '') =>
  str.trim().split(/\s+/).slice(0, 2).map(s => s[0]?.toUpperCase()).join('') || '?'

export default function Orders() {
  const { token } = useAuthAdmin()
  const { showToast } = useToast()
  const [orders, setOrders]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [filter, setFilter]       = useState('')

  const load = () => {
    setLoading(true)
    getOrders(token, '').then(res => {
      if (res.success) setOrders(res.data)
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  const handleStatusChange = async (id, status) => {
    const res = await updateOrderStatus(id, status, token)
    if (res.success) {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
      showToast(`Orden #${id} → ${STATUS_LABELS[status]}`, 'success')
    } else {
      showToast(res.error || 'Error al actualizar el estado', 'error')
    }
  }

  const counts = useMemo(() => {
    const c = { '': orders.length, pending: 0, paid: 0, shipped: 0, delivered: 0, cancelled: 0 }
    orders.forEach(o => { c[o.status] = (c[o.status] || 0) + 1 })
    return c
  }, [orders])

  const filtered = filter ? orders.filter(o => o.status === filter) : orders

  const revenue = orders
    .filter(o => ['paid', 'shipped', 'delivered'].includes(o.status))
    .reduce((sum, o) => sum + parseFloat(o.total), 0)

  const stats = [
    {
      icon: 'receipt_long',
      iconClass: 'metric-card__icon--primary',
      badge: 'Total',
      badgeClass: 'metric-card__badge--info',
      label: 'Órdenes',
      value: orders.length,
    },
    {
      icon: 'payments',
      iconClass: 'metric-card__icon--success',
      badge: 'Confirmado',
      badgeClass: 'metric-card__badge--success',
      label: 'Ingresos',
      value: formatPrice(revenue),
    },
    {
      icon: 'pending_actions',
      iconClass: 'metric-card__icon--warning',
      badge: counts.pending > 0 ? 'Atención' : 'OK',
      badgeClass: 'metric-card__badge--warning',
      label: 'Pendientes',
      value: counts.pending,
    },
    {
      icon: 'local_shipping',
      iconClass: 'metric-card__icon--info',
      badge: 'En tránsito',
      badgeClass: 'metric-card__badge--info',
      label: 'Enviadas',
      value: counts.shipped,
    },
  ]

  if (loading) return <Loader />

  return (
    <>
      <div className="product-form-header">
        <div>
          <h1 className="admin-page-header__title">Órdenes</h1>
          <p className="admin-page-header__subtitle">
            Gestioná los pedidos de tus clientes y actualizá su estado.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="admin-metrics">
        {stats.map((s, i) => (
          <div key={i} className="metric-card">
            <div className="metric-card__head">
              <div className={`metric-card__icon ${s.iconClass}`}>
                <span className="material-symbols-outlined">{s.icon}</span>
              </div>
              <span className={`metric-card__badge ${s.badgeClass}`}>{s.badge}</span>
            </div>
            <p className="metric-card__label">{s.label}</p>
            <p className="metric-card__value">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div className="filter-pills">
        <button
          type="button"
          className={`filter-pill${filter === '' ? ' filter-pill--active' : ''}`}
          onClick={() => setFilter('')}
        >
          Todas
          <span className="filter-pill__count">{counts['']}</span>
        </button>
        {Object.entries(STATUS_LABELS).map(([k, label]) => (
          <button
            key={k}
            type="button"
            className={`filter-pill${filter === k ? ' filter-pill--active' : ''}`}
            onClick={() => setFilter(k)}
          >
            {label}
            <span className="filter-pill__count">{counts[k] ?? 0}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="inventory-card">
        {filtered.length === 0 ? (
          <div className="inventory-empty">
            <span className="material-symbols-outlined">inbox</span>
            <p>{orders.length === 0 ? 'Todavía no hay órdenes.' : 'No hay órdenes con ese estado.'}</p>
          </div>
        ) : (
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Orden</th>
                <th>Cliente</th>
                <th>Pago</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Cambiar estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
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
                  <td>
                    <select
                      className="inline-select"
                      value={o.status}
                      onChange={e => handleStatusChange(o.id, e.target.value)}
                    >
                      {Object.entries(STATUS_LABELS).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
