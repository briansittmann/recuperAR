import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Header from '../../components/common/Header.jsx'
import Footer from '../../components/common/Footer.jsx'
import Loader from '../../components/common/Loader.jsx'
import ContactModal from '../../components/common/ContactModal.jsx'
import { getProduct, getProducts } from '../../api/products.js'
import { useCart } from '../../context/CartContext.jsx'
import { formatPrice } from '../../utils/formatPrice.js'
import { useScrollAnimation } from '../../hooks/useScrollAnimation.js'
import { getImageUrl } from '../../utils/getImageUrl.js'
import { productPath, parseProductId } from '../../utils/slugify.js'
import '../../styles/catalog.css'
import '../../styles/product-detail.css'
const DESC_LIMIT = 80
const RELATED_LIMIT = 4

const truncate = (str, n) => {
  if (!str) return ''
  return str.length > n ? str.slice(0, n).trimEnd() + '…' : str
}

export default function ProductDetail() {
  const { slug } = useParams()
  const id = parseProductId(slug)
  const navigate = useNavigate()
  const { addItem, count } = useCart()
  const [product, setProduct]         = useState(null)
  const [related, setRelated]         = useState([])
  const [selectedVariant, setVariant] = useState(null)
  const [activeImage, setActiveImage] = useState(null)
  const [loading, setLoading]         = useState(true)
  const [added, setAdded]             = useState(false)
  const [contactOpen, setContactOpen] = useState(false)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    setLoading(true)
    setProduct(null)
    setRelated([])
    setVariant(null)
    setActiveImage(null)
    window.scrollTo({ top: 0 })

    getProduct(id).then(res => {
      if (res.success) {
        setProduct(res.data)
        if (res.data.variants?.length > 0) setVariant(res.data.variants[0])
        setActiveImage(res.data.image || res.data.images?.[0]?.image || null)
        if (res.data.category_slug) {
          getProducts({ category: res.data.category_slug }).then(r => {
            if (r.success) {
              setRelated(r.data.filter(p => p.id !== res.data.id).slice(0, RELATED_LIMIT))
            }
          })
        }
      }
      setLoading(false)
    })
  }, [id])

  const handleAdd = () => {
    if (!selectedVariant) return
    addItem(product, selectedVariant, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  useScrollAnimation([product, related])

  if (loading) {
    return (
      <div className="product-page">
        <Header />
        <div className="product-state"><Loader /></div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="product-page">
        <Header />
        <div className="product-state">Producto no encontrado.</div>
        <Footer />
      </div>
    )
  }

  const hasVariants = product.variants?.length > 0
  const price       = selectedVariant?.price
  const isInquiry   = !hasVariants || !price

  // Galería = portada + imágenes adicionales (filtramos duplicados si la portada también está en la galería)
  const allImages = [
    ...(product.image ? [{ id: 'cover', image: product.image }] : []),
    ...(product.images || []).filter(img => img.image !== product.image),
  ]

  return (
    <div className="product-page">
      <Header />

      <main className="product-main">
        <button type="button" className="product-back" onClick={() => navigate(-1)}>
          <span className="material-symbols-outlined">arrow_back</span>
          Volver
        </button>

        <section className="product-detail">
          {/* Gallery */}
          <div className="product-gallery-wrap" data-animate="fade-up">
            <div className="product-gallery">
              {activeImage
                ? <img src={getImageUrl(activeImage)} alt={product.name} className="product-gallery__img" />
                : <div className="product-gallery__placeholder"><span className="material-symbols-outlined">image</span></div>
              }
            </div>
            {allImages.length > 1 && (
              <div className="product-gallery__thumbs">
                {allImages.map(img => (
                  <button
                    key={img.id}
                    type="button"
                    className={`product-gallery__thumb${activeImage === img.image ? ' product-gallery__thumb--active' : ''}`}
                    onClick={() => setActiveImage(img.image)}
                    aria-label="Ver imagen"
                  >
                    <img src={getImageUrl(img.image)} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-info" data-animate="fade-up" data-delay="100">
            <nav className="product-breadcrumb">
              <Link to="/catalogo">Catálogo</Link>
              {product.category_name && (
                <>
                  <span className="product-breadcrumb__sep">/</span>
                  <Link to="/catalogo">{product.category_name}</Link>
                </>
              )}
              <span className="product-breadcrumb__sep">/</span>
              <span className="product-breadcrumb__current">{product.name}</span>
            </nav>

            <h1 className="product-title">{product.name}</h1>

            {price && (
              <p className="product-price">{formatPrice(price)}</p>
            )}

            {product.description && (
              <div className="product-desc-card">
                <h3 className="product-desc-card__label">Descripción</h3>
                <p className="product-desc-card__text">{product.description}</p>
              </div>
            )}

            {hasVariants && (
              <div className="product-sizes">
                <h3 className="product-sizes__label">Seleccionar Talle</h3>
                <div className="product-sizes__options">
                  {product.variants.map(v => (
                    <button
                      key={v.id}
                      type="button"
                      className={`size-btn${selectedVariant?.id === v.id ? ' size-btn--active' : ''}`}
                      disabled={v.stock === 0}
                      onClick={() => setVariant(v)}
                    >
                      {v.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="product-actions">
              {isInquiry ? (
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => setContactOpen(true)}
                >
                  <span className="material-symbols-outlined">mail</span>
                  Consultar
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={handleAdd}
                  disabled={!selectedVariant || selectedVariant.stock === 0}
                >
                  <span className="material-symbols-outlined">shopping_bag</span>
                  {added ? '¡Agregado al carrito!' : 'Añadir al Carrito'}
                </button>
              )}
            </div>

            <div className="product-features">
              <div className="feature-card">
                <div className="feature-card__icon">
                  <span className="material-symbols-outlined">local_shipping</span>
                </div>
                <div>
                  <div className="feature-card__title">Envío gratis a todo AMBA</div>
                  <div className="feature-card__sub">Llegamos a todo el país</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related products */}
        {related.length > 0 && (
          <section className="related-section">
            <h2 className="related-section__title" data-animate="fade-up">También te puede interesar</h2>
            <div className="products-grid-new">
              {related.map((p, i) => (
                <Link
                  key={p.id}
                  to={productPath(p)}
                  className="product-card-glass"
                  data-animate="fade-up"
                  data-delay={i * 90}
                >
                  <div className="product-card-glass__img-wrap">
                    {p.image
                      ? <img src={getImageUrl(p.image)} alt={p.name} className="product-card-glass__img" />
                      : <span className="material-symbols-outlined product-card-glass__img-placeholder">image</span>
                    }
                  </div>
                  <div className="product-card-glass__body">
                    <h4 className="product-card-glass__name">{p.name}</h4>
                    <p className="product-card-glass__desc">
                      {truncate(p.description, DESC_LIMIT) || ' '}
                    </p>
                    <div className="product-card-glass__footer">
                      <span className="product-card-glass__price">
                        {p.min_price ? formatPrice(p.min_price) : ''}
                      </span>
                      <span className="product-card-glass__cart-btn">
                        <span className="material-symbols-outlined">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Float buttons (desktop) */}
      <div className="catalog-float">
        <a href="https://wa.me/541152210035" target="_blank" rel="noopener noreferrer" className="float-btn float-btn--whatsapp" title="WhatsApp">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.235 1.592 5.228 0 9.483-4.256 9.485-9.485.002-5.235-4.262-9.485-9.487-9.485-5.228 0-9.483 4.256-9.485 9.485 0 2.035.566 3.541 1.644 5.22l-.961 3.511 3.569-.928zm10.596-6.703c-.313-.157-1.851-.913-2.138-1.018-.286-.104-.495-.157-.704.157-.209.314-.809 1.018-.992 1.227-.182.209-.364.235-.677.079-1.34-.673-2.222-1.12-3.111-2.651-.235-.404.235-.375.673-1.25.078-.157.039-.294-.02-.411-.059-.117-.495-1.192-.678-1.633-.178-.432-.359-.373-.495-.38l-.421-.008c-.144 0-.379.054-.577.269-.198.214-.756.738-.756 1.8 0 1.062.772 2.088.88 2.232.108.144 1.519 2.319 3.679 3.251 2.16.932 2.16.621 2.551.584.391-.037 1.264-.517 1.442-1.018.178-.501.178-.931.124-1.018-.053-.087-.194-.139-.507-.296z" />
          </svg>
        </a>
        <a href="tel:+541152210035" className="float-btn float-btn--phone" title="Llamar">
          <span className="material-symbols-outlined">call</span>
        </a>
      </div>

      {/* Mobile bottom nav */}
      <nav className="mobile-bottom-nav">
        <Link to="/" className="mobile-bottom-nav__item">
          <span className="material-symbols-outlined">home</span>
          <span>Inicio</span>
        </Link>
        <Link to="/catalogo" className="mobile-bottom-nav__item mobile-bottom-nav__item--active">
          <span className="material-symbols-outlined">grid_view</span>
          <span>Catálogo</span>
        </Link>
        <Link to="/carrito" className="mobile-bottom-nav__item">
          <span className="material-symbols-outlined">shopping_cart</span>
          <span>Carrito{count > 0 ? ` (${count})` : ''}</span>
        </Link>
        <a
          href="https://wa.me/541152210035"
          target="_blank"
          rel="noopener noreferrer"
          className="mobile-bottom-nav__item"
        >
          <span className="material-symbols-outlined">support_agent</span>
          <span>Contacto</span>
        </a>
      </nav>

      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        initialSubject={`Consulta sobre ${product.name}`}
        initialMessage={`Hola, me interesa el producto "${product.name}". ¿Podrían darme más información sobre disponibilidad y precio? Gracias.`}
      />

      <Footer />
    </div>
  )
}
