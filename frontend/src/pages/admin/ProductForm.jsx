import { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  getProduct, createProduct, updateProduct,
  createVariant, updateVariant, deleteVariant,
  addProductImages, deleteProductImage, reorderProductImages,
} from '../../api/products.js'
import { getCategories } from '../../api/categories.js'
import { useAuthAdmin } from '../../context/AuthAdminContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { formatPrice } from '../../utils/formatPrice.js'
import { getImageUrl } from '../../utils/getImageUrl.js'
import Loader from '../../components/common/Loader.jsx'
import '../../styles/admin-products.css'
import '../../styles/admin-product-form.css'
const EMPTY_VARIANT = { size: '', price: '', stock: '0' }

export default function ProductForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { token } = useAuthAdmin()
  const { showToast } = useToast()

  const [loading, setLoading]     = useState(isEdit)
  const [saving, setSaving]       = useState(false)
  const [categories, setCategories] = useState([])
  const [error, setError]         = useState('')

  const [name, setName]               = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId]   = useState('')
  const [imageFile, setImageFile]     = useState(null)
  const [existingImage, setExistingImage] = useState(null)
  const [removeImage, setRemoveImage] = useState(false)

  const [variants, setVariants]       = useState([])
  const [varForm, setVarForm]         = useState(EMPTY_VARIANT)
  const [editingVarId, setEditingVar] = useState(null)
  const [dragging, setDragging]       = useState(false)

  const [gallery, setGallery]         = useState([])
  const [galleryUploading, setGalleryUploading] = useState(false)
  const [galleryDragOver, setGalleryDragOver]   = useState(false)
  const [draggedId, setDraggedId]     = useState(null)
  const [dropTargetId, setDropTarget] = useState(null)

  const fileInputRef = useRef(null)

  useEffect(() => {
    getCategories().then(res => { if (res.success) setCategories(res.data) })
  }, [])

  useEffect(() => {
    if (!isEdit) return
    setLoading(true)
    getProduct(id).then(res => {
      if (res.success) {
        const p = res.data
        setName(p.name || '')
        setDescription(p.description || '')
        setCategoryId(p.category_id || '')
        setExistingImage(p.image || null)
        setVariants(p.variants || [])
        setGallery(p.images || [])
      } else {
        setError(res.error || 'Producto no encontrado')
      }
      setLoading(false)
    })
  }, [id, isEdit])

  const reloadVariants = async () => {
    if (!isEdit) return
    const res = await getProduct(id)
    if (res.success) setVariants(res.data.variants || [])
  }

  // ── Image handlers ────────────────────────────────────────────────────
  const handleFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('El archivo debe ser una imagen')
      return
    }
    setImageFile(file)
    setRemoveImage(false)
    setError('')
  }
  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files?.[0])
  }
  const handleRemoveImage = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setImageFile(null)
    setRemoveImage(true)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // ── Submit producto ───────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    const fd = new FormData()
    fd.append('name', name)
    fd.append('description', description)
    if (categoryId) fd.append('category_id', categoryId)
    if (imageFile) fd.append('image', imageFile)

    const res = isEdit
      ? await updateProduct(id, fd, token)
      : await createProduct(fd, token)

    setSaving(false)

    if (res.success) {
      const newId = res.data?.id ?? id
      showToast(isEdit ? 'Producto actualizado' : 'Producto creado', 'success')
      if (!isEdit && newId) {
        navigate(`/admin/productos/${newId}/editar`, { replace: true })
      } else {
        // refresh existing image preview
        if (res.data?.image) setExistingImage(res.data.image)
        setImageFile(null)
        setRemoveImage(false)
      }
    } else {
      setError(res.error || 'Error al guardar el producto')
      showToast(res.error || 'Error al guardar', 'error')
    }
  }

  // ── Variant handlers ─────────────────────────────────────────────────
  const handleVarSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const data = {
      product_id: parseInt(id),
      size: varForm.size,
      price: parseFloat(varForm.price),
      stock: parseInt(varForm.stock || 0),
    }
    const wasEditing = Boolean(editingVarId)
    const res = wasEditing
      ? await updateVariant(editingVarId, data, token)
      : await createVariant(data, token)
    if (res.success) {
      showToast(wasEditing ? 'Variante actualizada' : 'Variante agregada', 'success')
      setVarForm(EMPTY_VARIANT)
      setEditingVar(null)
      reloadVariants()
    } else {
      setError(res.error || 'Error al guardar la variante')
      showToast(res.error || 'Error al guardar la variante', 'error')
    }
  }

  const handleEditVariant = (v) => {
    setEditingVar(v.id)
    setVarForm({ size: v.size, price: v.price, stock: v.stock })
  }
  const handleCancelEditVariant = () => {
    setEditingVar(null)
    setVarForm(EMPTY_VARIANT)
  }
  const handleDeleteVariant = async (vid) => {
    if (!confirm('¿Eliminar esta variante?')) return
    const res = await deleteVariant(vid, token)
    if (res.success) {
      showToast('Variante eliminada', 'success')
      reloadVariants()
    } else {
      showToast(res.error || 'Error al eliminar la variante', 'error')
    }
  }

  // ── Gallery handlers ─────────────────────────────────────────────────
  const handleGalleryUpload = async (files) => {
    if (!files || files.length === 0) return
    const remaining = 6 - gallery.length
    if (remaining <= 0) {
      setError('Ya alcanzaste el máximo de 6 imágenes')
      return
    }
    const toUpload = Array.from(files).slice(0, remaining)
    setGalleryUploading(true)
    setError('')
    const res = await addProductImages(id, toUpload, token)
    setGalleryUploading(false)
    if (res.success) {
      setGallery(prev => [...prev, ...res.data.images])
      showToast(`${res.data.images.length} imagen${res.data.images.length !== 1 ? 'es' : ''} agregada${res.data.images.length !== 1 ? 's' : ''}`, 'success')
    } else {
      setError(res.error || 'Error al subir las imágenes')
      showToast(res.error || 'Error al subir las imágenes', 'error')
    }
  }

  const handleDeleteGalleryImage = async (imgId) => {
    if (!confirm('¿Eliminar esta imagen?')) return
    const res = await deleteProductImage(imgId, token)
    if (res.success) {
      setGallery(prev => prev.filter(img => img.id !== imgId))
      showToast('Imagen eliminada', 'success')
    } else {
      setError(res.error || 'Error al eliminar la imagen')
      showToast(res.error || 'Error al eliminar', 'error')
    }
  }

  const handleGalleryDragStart = (imgId) => (e) => {
    setDraggedId(imgId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(imgId))
  }

  const handleGalleryDragOver = (imgId) => (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (imgId !== draggedId) setDropTarget(imgId)
  }

  const handleGalleryDragEnd = () => {
    setDraggedId(null)
    setDropTarget(null)
  }

  const handleGalleryDrop = (targetId) => async (e) => {
    e.preventDefault()
    if (!draggedId || draggedId === targetId) {
      handleGalleryDragEnd()
      return
    }
    const fromIdx = gallery.findIndex(g => g.id === draggedId)
    const toIdx   = gallery.findIndex(g => g.id === targetId)
    if (fromIdx === -1 || toIdx === -1) return

    const next = [...gallery]
    const [moved] = next.splice(fromIdx, 1)
    next.splice(toIdx, 0, moved)
    setGallery(next)
    handleGalleryDragEnd()

    const orderIds = next.map(g => g.id)
    const res = await reorderProductImages(orderIds, token)
    if (res.success) {
      showToast('Orden actualizado', 'success', 2000)
    } else {
      setError('Error al reordenar')
      showToast('Error al reordenar', 'error')
      // Revert
      const revertRes = await getProduct(id)
      if (revertRes.success) setGallery(revertRes.data.images || [])
    }
  }

  if (loading) return <Loader />

  // Image preview source
  const imagePreviewUrl = imageFile
    ? URL.createObjectURL(imageFile)
    : (!removeImage && existingImage ? getImageUrl(existingImage) : null)

  return (
    <>
      <div className="product-form-header">
        <div>
          <h1 className="admin-page-header__title">
            {isEdit ? 'Editar producto' : 'Nuevo producto'}
          </h1>
          <p className="admin-page-header__subtitle">
            {isEdit
              ? 'Actualizá la información, imagen y variantes del producto.'
              : 'Completá la información básica para crear el producto.'}
          </p>
        </div>
        <div className="product-form-header__actions">
          <button type="button" className="admin-btn admin-btn--ghost" onClick={() => navigate('/admin/productos')}>
            Cancelar
          </button>
          <button type="submit" form="product-form" className="admin-btn admin-btn--primary" disabled={saving}>
            <span className="material-symbols-outlined">save</span>
            {saving ? 'Guardando…' : (isEdit ? 'Guardar cambios' : 'Crear producto')}
          </button>
        </div>
      </div>

      <form id="product-form" onSubmit={handleSubmit} className="product-form-grid">
        {/* Basic info */}
        <section className="form-card form-card--col-8">
          <div className="form-card__head">
            <span className="material-symbols-outlined">info</span>
            <h2 className="form-card__title">Información básica</h2>
          </div>
          <div className="form-card__body">
            <div className="liquid-field">
              <label className="liquid-field__label liquid-field__label--required">Nombre del producto</label>
              <input
                type="text"
                className="liquid-input"
                placeholder="Ej. Silla de ruedas ultraliviana"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="liquid-field">
              <label className="liquid-field__label">Descripción</label>
              <textarea
                className="liquid-input"
                placeholder="Detalles, características y materiales del producto…"
                rows="6"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Image upload */}
        <section className="form-card form-card--col-4">
          <div className="form-card__head">
            <span className="material-symbols-outlined">image</span>
            <h2 className="form-card__title">Imagen principal</h2>
          </div>
          <div className="form-card__body">
            <label
              className={`image-upload${imagePreviewUrl ? ' image-upload--has-file' : ''}${dragging ? ' image-upload--dragging' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={e => handleFile(e.target.files?.[0])}
                className="image-upload__input"
              />
              {imagePreviewUrl ? (
                <div className="image-preview">
                  <img src={imagePreviewUrl} alt="Vista previa" />
                  <button type="button" className="image-preview__remove" onClick={handleRemoveImage}>
                    <span className="material-symbols-outlined">close</span>
                  </button>
                  <span className="image-preview__hint">
                    {imageFile ? 'Nueva imagen' : 'Imagen actual'}
                  </span>
                </div>
              ) : (
                <>
                  <div className="image-upload__icon">
                    <span className="material-symbols-outlined">upload_file</span>
                  </div>
                  <span className="image-upload__title">Soltá la imagen acá</span>
                  <span className="image-upload__hint">o hacé click para elegir un archivo</span>
                  <span className="image-upload__hint">JPG, PNG o WebP</span>
                </>
              )}
            </label>
          </div>
        </section>

        {/* Categoría */}
        <section className="form-card form-card--col-4">
          <div className="form-card__head">
            <span className="material-symbols-outlined">category</span>
            <h2 className="form-card__title">Categoría</h2>
          </div>
          <div className="form-card__body">
            <div className="liquid-field">
              <label className="liquid-field__label">Categoría</label>
              <select
                className="liquid-input"
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
              >
                <option value="">Sin categoría</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Variants section (only when editing) */}
        {isEdit ? (
          <section className="form-card form-card--col-8">
            <div className="form-card__head">
              <span className="material-symbols-outlined">tune</span>
              <h2 className="form-card__title">Variantes (talles, precio, stock)</h2>
            </div>
            <div className="form-card__body">
              {variants.length === 0 ? (
                <div className="variants-empty">
                  <span className="material-symbols-outlined">layers</span>
                  <p>Todavía no hay variantes. Agregá la primera abajo.</p>
                </div>
              ) : (
                <div className="variants-list">
                  {variants.map(v => (
                    <div key={v.id} className="variant-row">
                      <div className="variant-row__field">
                        <span className="variant-row__field-label">Talle</span>
                        <span className="variant-row__value">{v.size}</span>
                      </div>
                      <div className="variant-row__field">
                        <span className="variant-row__field-label">Precio</span>
                        <span className="variant-row__value">{formatPrice(v.price)}</span>
                      </div>
                      <div className="variant-row__field">
                        <span className="variant-row__field-label">Stock</span>
                        <span className="variant-row__value">{v.stock}</span>
                      </div>
                      <div className="variant-row__actions">
                        <button type="button" className="variant-row__btn" aria-label="Editar" onClick={() => handleEditVariant(v)}>
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button type="button" className="variant-row__btn variant-row__btn--danger" aria-label="Eliminar" onClick={() => handleDeleteVariant(v.id)}>
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Inline add/edit variant form */}
              <div className="variant-form">
                <div className="liquid-field">
                  <label className="liquid-field__label">Talle</label>
                  <input
                    type="text"
                    className="liquid-input"
                    placeholder="M, L, XL, único…"
                    value={varForm.size}
                    onChange={e => setVarForm({ ...varForm, size: e.target.value })}
                  />
                </div>
                <div className="liquid-field">
                  <label className="liquid-field__label">Precio</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="liquid-input"
                    placeholder="0.00"
                    value={varForm.price}
                    onChange={e => setVarForm({ ...varForm, price: e.target.value })}
                  />
                </div>
                <div className="liquid-field">
                  <label className="liquid-field__label">Stock</label>
                  <input
                    type="number"
                    min="0"
                    className="liquid-input"
                    placeholder="0"
                    value={varForm.stock}
                    onChange={e => setVarForm({ ...varForm, stock: e.target.value })}
                  />
                </div>
                <div className="variant-form__actions">
                  {editingVarId && (
                    <button type="button" className="admin-btn admin-btn--ghost" onClick={handleCancelEditVariant}>
                      Cancelar
                    </button>
                  )}
                  <button type="button" className="admin-btn admin-btn--primary" onClick={handleVarSubmit} disabled={!varForm.size || !varForm.price}>
                    <span className="material-symbols-outlined">{editingVarId ? 'check' : 'add'}</span>
                    {editingVarId ? 'Guardar' : 'Agregar'}
                  </button>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="form-card form-card--col-12">
            <div className="form-card__head">
              <span className="material-symbols-outlined">tune</span>
              <h2 className="form-card__title">Variantes</h2>
            </div>
            <div className="variants-empty">
              <span className="material-symbols-outlined">save</span>
              <p>Primero guardá el producto para poder agregar talles, precios y stock.</p>
            </div>
          </section>
        )}

        {/* Galería de imágenes adicionales (solo edit) */}
        {isEdit && (
          <section className="form-card form-card--col-12">
            <div className="form-card__head">
              <span className="material-symbols-outlined">photo_library</span>
              <h2 className="form-card__title">Galería de imágenes</h2>
            </div>
            <div className="form-card__body">
              <div className="gallery-grid">
                {gallery.map((img, idx) => (
                  <div
                    key={img.id}
                    className={`gallery-item${draggedId === img.id ? ' gallery-item--dragging' : ''}${dropTargetId === img.id ? ' gallery-item--drop-target' : ''}`}
                    draggable
                    onDragStart={handleGalleryDragStart(img.id)}
                    onDragOver={handleGalleryDragOver(img.id)}
                    onDragEnd={handleGalleryDragEnd}
                    onDrop={handleGalleryDrop(img.id)}
                  >
                    <img src={getImageUrl(img.image)} alt={`Imagen ${idx + 1}`} className="gallery-item__img" />
                    <span className="gallery-item__order">{idx + 1}</span>
                    <button
                      type="button"
                      className="gallery-item__remove"
                      aria-label="Eliminar imagen"
                      onClick={() => handleDeleteGalleryImage(img.id)}
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                ))}

                {gallery.length < 6 && (
                  <label
                    className={`gallery-add${galleryDragOver ? ' gallery-add--dragging' : ''}`}
                    onDragOver={e => { e.preventDefault(); setGalleryDragOver(true) }}
                    onDragLeave={() => setGalleryDragOver(false)}
                    onDrop={e => {
                      e.preventDefault()
                      setGalleryDragOver(false)
                      handleGalleryUpload(e.dataTransfer.files)
                    }}
                  >
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      className="gallery-add__input"
                      onChange={e => { handleGalleryUpload(e.target.files); e.target.value = '' }}
                      disabled={galleryUploading}
                    />
                    <div className="gallery-add__icon">
                      <span className="material-symbols-outlined">
                        {galleryUploading ? 'progress_activity' : 'add'}
                      </span>
                    </div>
                    <span className="gallery-add__title">
                      {galleryUploading ? 'Subiendo…' : 'Agregar'}
                    </span>
                    <span className="gallery-add__hint">JPG, PNG o WebP</span>
                  </label>
                )}
              </div>

              {gallery.length === 0 && !galleryUploading && (
                <p className="gallery-empty">
                  Sumá hasta 6 imágenes adicionales. Arrastralas para reordenar.
                </p>
              )}

              <div className="gallery-meta">
                <span>{gallery.length} / 6 imágenes</span>
                {gallery.length > 1 && <span>Arrastrá para reordenar</span>}
              </div>
            </div>
          </section>
        )}

        {error && (
          <div className="form-error" style={{ gridColumn: 'span 12' }}>
            <span className="material-symbols-outlined">error</span>
            <span>{error}</span>
          </div>
        )}
      </form>
    </>
  )
}
