import { useEffect, useMemo, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getProducts, deleteProduct } from '../../api/products.js'
import { getCategories } from '../../api/categories.js'
import { useAuthAdmin } from '../../context/AuthAdminContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { formatPrice } from '../../utils/formatPrice.js'
import { getImageUrl } from '../../utils/getImageUrl.js'
import Loader from '../../components/common/Loader.jsx'
import '../../styles/admin-products.css'
const PAGE_SIZE = 10
const LOW_STOCK_THRESHOLD = 5

function stockStatus(stock) {
  if (stock <= 0)                    return { className: 'stock-status--out', label: 'Sin stock' }
  if (stock <= LOW_STOCK_THRESHOLD)  return { className: 'stock-status--low', label: 'Stock bajo' }
  return { className: 'stock-status--ok', label: 'En stock' }
}

export default function Products() {
  const { token } = useAuthAdmin()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [products, setProducts]       = useState([])
  const [categories, setCategories]   = useState([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [categoryFilter, setCategory] = useState('')
  const [page, setPage]               = useState(1)
  const [openMenu, setOpenMenu]       = useState(null)
  const menuRef = useRef(null)

  const load = () => {
    setLoading(true)
    Promise.all([getProducts(), getCategories()]).then(([pRes, cRes]) => {
      if (pRes.success) setProducts(pRes.data)
      if (cRes.success) setCategories(cRes.data)
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenu(null)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar producto? Se borrarán también sus variantes.')) return
    const res = await deleteProduct(id, token)
    if (res.success) {
      showToast('Producto eliminado', 'success')
      load()
    } else {
      showToast(res.error || 'Error al eliminar', 'error')
    }
    setOpenMenu(null)
  }

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (categoryFilter && p.category_slug !== categoryFilter) return false
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [products, categoryFilter, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  // Stats
  const totalCount  = products.length
  const totalStock  = products.reduce((s, p) => s + Number(p.total_stock || 0), 0)
  const lowCount    = products.filter(p => {
    const s = Number(p.total_stock || 0)
    return s > 0 && s <= LOW_STOCK_THRESHOLD
  }).length
  const outCount    = products.filter(p => Number(p.total_stock || 0) === 0).length

  const stats = [
    {
      icon: 'inventory_2',
      iconClass: 'metric-card__icon--primary',
      label: 'Productos',
      value: totalCount,
      badge: 'Total',
      badgeClass: 'metric-card__badge--info',
    },
    {
      icon: 'package_2',
      iconClass: 'metric-card__icon--success',
      label: 'Stock total',
      value: totalStock,
      badge: 'Unidades',
      badgeClass: 'metric-card__badge--success',
    },
    {
      icon: 'warning',
      iconClass: 'metric-card__icon--warning',
      label: 'Stock bajo',
      value: lowCount,
      badge: lowCount > 0 ? 'Atención' : 'OK',
      badgeClass: 'metric-card__badge--warning',
    },
    {
      icon: 'error',
      iconClass: 'metric-card__icon--info',
      label: 'Sin stock',
      value: outCount,
      badge: outCount > 0 ? `${outCount}` : '—',
      badgeClass: 'metric-card__badge--info',
    },
  ]

  if (loading) return <Loader />

  return (
    <>
      <div className="product-form-header">
        <div>
          <h1 className="admin-page-header__title">Productos</h1>
          <p className="admin-page-header__subtitle">Gestioná tu catálogo y stock.</p>
        </div>
        <div className="product-form-header__actions">
          <Link to="/admin/productos/nuevo" className="admin-btn admin-btn--primary">
            <span className="material-symbols-outlined">add</span>
            Nuevo producto
          </Link>
        </div>
      </div>

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

      <div className="admin-filters">
        <div className="admin-search">
          <span className="material-symbols-outlined admin-search__icon">search</span>
          <input
            type="text"
            className="admin-search__input"
            placeholder="Buscar productos…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <select
          className="admin-filter-select"
          value={categoryFilter}
          onChange={e => { setCategory(e.target.value); setPage(1) }}
        >
          <option value="">Todas las categorías</option>
          {categories.map(c => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="inventory-card">
        {pageItems.length === 0 ? (
          <div className="inventory-empty">
            <span className="material-symbols-outlined">inventory_2</span>
            <p>{products.length === 0 ? 'Todavía no hay productos.' : 'No se encontraron productos con esos filtros.'}</p>
          </div>
        ) : (
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map(p => {
                const stock  = Number(p.total_stock || 0)
                const status = stockStatus(stock)
                return (
                  <tr key={p.id} onClick={() => navigate(`/admin/productos/${p.id}/editar`)}>
                    <td>
                      <div className="inventory-table__product">
                        <div className="inventory-table__img">
                          {p.image
                            ? <img src={getImageUrl(p.image)} alt={p.name} />
                            : <span className="material-symbols-outlined">image</span>
                          }
                        </div>
                        <div className="inventory-table__info">
                          <div className="inventory-table__name">{p.name}</div>
                          <div className="inventory-table__sub">
                            {p.variant_count > 0 ? `${p.variant_count} variante${p.variant_count !== 1 ? 's' : ''}` : 'Sin variantes'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {p.category_name
                        ? <span className="category-badge">{p.category_name}</span>
                        : <span className="category-badge category-badge--empty">—</span>
                      }
                    </td>
                    <td className="inventory-table__price">
                      {p.min_price ? formatPrice(p.min_price) : '—'}
                    </td>
                    <td>
                      <div className="stock-cell">
                        <span className="stock-cell__count">{stock}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`stock-status ${status.className}`}>{status.label}</span>
                    </td>
                    <td style={{ textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                      <div className="row-actions" ref={openMenu === p.id ? menuRef : null}>
                        <button
                          type="button"
                          className="row-actions__btn"
                          aria-label="Más acciones"
                          onClick={() => setOpenMenu(openMenu === p.id ? null : p.id)}
                        >
                          <span className="material-symbols-outlined">more_vert</span>
                        </button>
                        {openMenu === p.id && (
                          <div className="row-actions__menu">
                            <Link to={`/admin/productos/${p.id}/editar`} className="row-actions__item" onClick={() => setOpenMenu(null)}>
                              <span className="material-symbols-outlined">edit</span>
                              Editar
                            </Link>
                            <button type="button" className="row-actions__item row-actions__item--danger" onClick={() => handleDelete(p.id)}>
                              <span className="material-symbols-outlined">delete</span>
                              Eliminar
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}

        {filtered.length > 0 && (
          <div className="inventory-footer">
            <p className="inventory-footer__info">
              Mostrando {(currentPage - 1) * PAGE_SIZE + 1} – {Math.min(currentPage * PAGE_SIZE, filtered.length)} de {filtered.length}
            </p>
            {totalPages > 1 && (
              <div className="inventory-pagination">
                <button
                  className="pagination-btn"
                  disabled={currentPage === 1}
                  onClick={() => setPage(currentPage - 1)}
                  aria-label="Página anterior"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    className={`pagination-btn${n === currentPage ? ' pagination-btn--active' : ''}`}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </button>
                ))}
                <button
                  className="pagination-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setPage(currentPage + 1)}
                  aria-label="Página siguiente"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
