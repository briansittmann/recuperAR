import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Header from '../../components/common/Header.jsx'
import Footer from '../../components/common/Footer.jsx'
import CategoryCard from '../../components/shop/CategoryCard.jsx'
import Loader from '../../components/common/Loader.jsx'
import { getProducts } from '../../api/products.js'
import { getCategories } from '../../api/categories.js'
import { formatPrice } from '../../utils/formatPrice.js'
import { useScrollAnimation } from '../../hooks/useScrollAnimation.js'
import { getImageUrl } from '../../utils/getImageUrl.js'
import { productPath } from '../../utils/slugify.js'
import bannerImg from '../../assets/catalogo-banner.jpg'
import '../../styles/catalog.css'
const PAGE_SIZE = 6
const DESC_LIMIT = 80

const truncate = (str, n) => {
  if (!str) return ''
  return str.length > n ? str.slice(0, n).trimEnd() + '…' : str
}

export default function Catalog() {
  const [allProducts, setAllProducts]   = useState([])
  const [products, setProducts]         = useState([])
  const [categories, setCategories]     = useState([])
  const [selectedCategory, setSelected] = useState(null)
  const [search, setSearch]             = useState('')
  const [loading, setLoading]           = useState(true)
  const [showAll, setShowAll]           = useState(false)

  useEffect(() => {
    getCategories().then(res => { if (res.success) setCategories(res.data) })
  }, [])

  useEffect(() => {
    setLoading(true)
    setShowAll(false)
    const params = {}
    if (selectedCategory) params.category = selectedCategory
    if (search)           params.search   = search
    getProducts(params).then(res => {
      if (res.success) {
        setAllProducts(res.data)
        setProducts(res.data.slice(0, PAGE_SIZE))
      }
      setLoading(false)
    })
  }, [selectedCategory, search])

  const handleCategoryClick = useCallback((id) => {
    setSelected(prev => prev === id ? null : id)
  }, [])

  const handleShowAll = () => {
    setProducts(allProducts)
    setShowAll(true)
  }

  const totalCount    = allProducts.length
  const activeCatName = selectedCategory
    ? categories.find(c => c.slug === selectedCategory)?.name
    : null

  useScrollAnimation([categories, products, loading])

  return (
    <div className="catalog-page">
      <Header />

      <main className="catalog-main">
        {/* Promotional banner */}
        <section className="catalog-banner glass liquid-shadow" data-animate="scale-in" data-delay="100">
          <div className="catalog-banner__content">
            <span className="catalog-banner__badge">Selección RecuperAR</span>
            <h2 className="catalog-banner__title">Soluciones de Movilidad a Medida</h2>
            <p className="catalog-banner__desc">
              Asesoramiento personalizado y tecnología premium para que nada detenga tu camino.
            </p>
            <a href="#productos" className="btn btn--primary catalog-banner__btn">Ver Catálogo</a>
          </div>
          <div className="catalog-banner__img-wrap">
            <img src={bannerImg} alt="Silla de traslado pediátrica" className="catalog-banner__img" />
          </div>
          <div className="catalog-banner__blob catalog-banner__blob--1" />
          <div className="catalog-banner__blob catalog-banner__blob--2" />
        </section>

        {/* Categories */}
        {categories.length > 0 && (
          <section className="catalog-section">
            <div className="catalog-section-header" data-animate="fade-up">
              <h3 className="catalog-section-title">Categorías</h3>
            </div>
            <div className="categories-grid">
              {categories.map((cat, i) => (
                <div key={cat.id} data-animate="fade-up" data-delay={i * 80}>
                  <CategoryCard
                    category={cat}
                    active={selectedCategory === cat.slug}
                    onClick={() => handleCategoryClick(cat.slug)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Search bar */}
        <div className="catalog-search-wrap" data-animate="fade-up">
          <div className="catalog-search-bar">
            <span className="material-symbols-outlined catalog-search-bar__icon">search</span>
            <input
              className="catalog-search-bar__input"
              type="text"
              placeholder="Buscar soluciones de movilidad..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button
              type="button"
              className="catalog-search-bar__btn"
              onClick={() => document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explorar
            </button>
          </div>
        </div>

        {/* Products */}
        <section className="catalog-section" id="productos">
          <div className="catalog-section-header" data-animate="fade-up">
            <h3 className="catalog-section-title">
              {activeCatName ?? 'Todos los productos'}
            </h3>
            {!loading && (
              <span className="catalog-products-count">
                {totalCount} producto{totalCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {loading ? (
            <div className="catalog-loader"><Loader /></div>
          ) : products.length === 0 ? (
            <p className="catalog-empty">No se encontraron productos.</p>
          ) : (
            <div className="products-grid-new">
              {products.map((product, i) => (
                <Link
                  key={product.id}
                  to={productPath(product)}
                  className="product-card-glass"
                  data-animate="fade-up"
                  data-delay={i * 90}
                >
                  <div className="product-card-glass__img-wrap">
                    {product.image
                      ? <img src={getImageUrl(product.image)} alt={product.name} className="product-card-glass__img" />
                      : <span className="material-symbols-outlined product-card-glass__img-placeholder">image</span>
                    }
                  </div>
                  <div className="product-card-glass__body">
                    <h4 className="product-card-glass__name">{product.name}</h4>
                    <p className="product-card-glass__desc">
                      {truncate(product.description, DESC_LIMIT) || ' '}
                    </p>
                    <div className="product-card-glass__footer">
                      <span className="product-card-glass__price">
                        {product.min_price ? formatPrice(product.min_price) : ''}
                      </span>
                      <span className="product-card-glass__cart-btn">
                        <span className="material-symbols-outlined">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && !showAll && totalCount > PAGE_SIZE && (
            <div className="catalog-more" data-animate="fade-up">
              <button className="btn btn--outline" onClick={handleShowAll}>
                Ver todos ({totalCount})
                <span className="material-symbols-outlined">expand_more</span>
              </button>
            </div>
          )}
        </section>
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
          <span>Carrito</span>
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

      <Footer />
    </div>
  )
}
