import { useEffect, useState, useRef } from 'react'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../api/categories.js'
import { useAuthAdmin } from '../../context/AuthAdminContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import Loader from '../../components/common/Loader.jsx'
import '../../styles/admin-products.css'
import '../../styles/admin-product-form.css'

const EMPTY = { name: '', slug: '', icon: '' }

const autoSlug = (name) =>
  name.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

export default function Categories() {
  const { token } = useAuthAdmin()
  const { showToast } = useToast()
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [form, setForm]             = useState(EMPTY)
  const [editing, setEditing]       = useState(null)
  const [error, setError]           = useState('')
  const [openMenu, setOpenMenu]     = useState(null)
  const menuRef = useRef(null)

  const load = () => {
    getCategories().then(res => {
      if (res.success) setCategories(res.data)
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

  const handleNameChange = (e) => {
    const name = e.target.value
    setForm(f => ({
      ...f,
      name,
      slug: editing ? f.slug : autoSlug(name),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const isEditing = Boolean(editing)
    const res = isEditing
      ? await updateCategory(editing.id, form, token)
      : await createCategory(form, token)
    if (res.success) {
      showToast(isEditing ? 'Categoría actualizada' : 'Categoría creada', 'success')
      setForm(EMPTY)
      setEditing(null)
      load()
    } else {
      setError(res.error || 'Error al guardar')
      showToast(res.error || 'Error al guardar la categoría', 'error')
    }
  }

  const handleEdit = (c) => {
    setEditing(c)
    setForm({ name: c.name, slug: c.slug, icon: c.icon || '' })
    setOpenMenu(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancel = () => {
    setEditing(null)
    setForm(EMPTY)
    setError('')
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar categoría? Los productos asociados quedarán sin categoría.')) return
    const res = await deleteCategory(id, token)
    if (res.success) {
      showToast('Categoría eliminada', 'success')
      load()
    } else {
      showToast(res.error || 'Error al eliminar', 'error')
    }
    setOpenMenu(null)
  }

  if (loading) return <Loader />

  return (
    <>
      <div className="product-form-header">
        <div>
          <h1 className="admin-page-header__title">Categorías</h1>
          <p className="admin-page-header__subtitle">
            Organizá tu catálogo en grupos con íconos.
          </p>
        </div>
      </div>

      {/* Form card */}
      <section className="form-card" style={{ marginBottom: '1.5rem' }}>
        <div className="form-card__head">
          <span className="material-symbols-outlined">{editing ? 'edit' : 'add'}</span>
          <h2 className="form-card__title">{editing ? 'Editar categoría' : 'Nueva categoría'}</h2>
        </div>
        <form onSubmit={handleSubmit} className="category-form">
          <div className="liquid-field">
            <label className="liquid-field__label liquid-field__label--required">Nombre</label>
            <input
              type="text"
              className="liquid-input"
              placeholder="Ej. Sillas de ruedas"
              value={form.name}
              onChange={handleNameChange}
              required
            />
          </div>

          <div className="liquid-field">
            <label className="liquid-field__label liquid-field__label--required">Slug (URL)</label>
            <input
              type="text"
              className="liquid-input"
              placeholder="sillas-de-ruedas"
              value={form.slug}
              onChange={e => setForm({ ...form, slug: e.target.value })}
              required
              pattern="[a-z0-9-]+"
              title="Solo minúsculas, números y guiones"
            />
          </div>

          <div className="liquid-field">
            <label className="liquid-field__label">Ícono (Material Symbols)</label>
            <div className="icon-field">
              <input
                type="text"
                className="liquid-input"
                placeholder="ej: accessibility_new"
                value={form.icon}
                onChange={e => setForm({ ...form, icon: e.target.value })}
              />
              <div className="icon-preview" title="Vista previa">
                <span className="material-symbols-outlined">{form.icon || 'category'}</span>
              </div>
            </div>
          </div>

          <div className="category-form__actions">
            <button type="submit" className="admin-btn admin-btn--primary">
              <span className="material-symbols-outlined">{editing ? 'save' : 'add'}</span>
              {editing ? 'Guardar cambios' : 'Crear categoría'}
            </button>
            {editing && (
              <button type="button" className="admin-btn admin-btn--ghost" onClick={handleCancel}>
                Cancelar
              </button>
            )}
          </div>

          {error && (
            <div className="form-error" style={{ gridColumn: '1 / -1' }}>
              <span className="material-symbols-outlined">error</span>
              <span>{error}</span>
            </div>
          )}
        </form>
      </section>

      {/* List card */}
      <div className="inventory-card">
        {categories.length === 0 ? (
          <div className="inventory-empty">
            <span className="material-symbols-outlined">category</span>
            <p>Todavía no hay categorías. Creá la primera arriba.</p>
          </div>
        ) : (
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Categoría</th>
                <th>Slug</th>
                <th>Ícono</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categories.map(c => (
                <tr key={c.id}>
                  <td>
                    <div className="inventory-table__product">
                      <div className="icon-preview icon-preview--small">
                        <span className="material-symbols-outlined">{c.icon || 'category'}</span>
                      </div>
                      <div className="inventory-table__info">
                        <div className="inventory-table__name">{c.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="category-badge">{c.slug}</span>
                  </td>
                  <td>
                    <code style={{ fontSize: '0.8125rem', color: 'var(--secondary)' }}>
                      {c.icon || '—'}
                    </code>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="row-actions" ref={openMenu === c.id ? menuRef : null}>
                      <button
                        type="button"
                        className="row-actions__btn"
                        aria-label="Más acciones"
                        onClick={() => setOpenMenu(openMenu === c.id ? null : c.id)}
                      >
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                      {openMenu === c.id && (
                        <div className="row-actions__menu">
                          <button type="button" className="row-actions__item" onClick={() => handleEdit(c)}>
                            <span className="material-symbols-outlined">edit</span>
                            Editar
                          </button>
                          <button type="button" className="row-actions__item row-actions__item--danger" onClick={() => handleDelete(c.id)}>
                            <span className="material-symbols-outlined">delete</span>
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
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
