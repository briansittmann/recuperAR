import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext.jsx'
import ContactModal from './ContactModal.jsx'
import logo from '../../assets/recuperar-logo.png'
import '../../styles/header.css'

export default function Header() {
  const { count } = useCart()
  const location = useLocation()
  const navigate = useNavigate()
  const [scrolled, setScrolled]       = useState(false)
  const [menuOpen, setMenuOpen]       = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [cartBump, setCartBump]       = useState(false)
  const prevCount = useRef(count)

  useEffect(() => {
    if (count > prevCount.current) {
      setCartBump(true)
      const t = setTimeout(() => setCartBump(false), 600)
      prevCount.current = count
      return () => clearTimeout(t)
    }
    prevCount.current = count
  }, [count])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [menuOpen])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const goHome = (e) => {
    e.preventDefault()
    setMenuOpen(false)
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/')
    }
  }

  const handleContact = (e) => {
    e.preventDefault()
    setMenuOpen(false)
    if (location.pathname === '/') {
      document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      setContactOpen(true)
    }
  }

  return (
    <>
      <header className={`header${scrolled ? ' header--scrolled' : ''}`}>
        <div className="header__inner">
          <button
            type="button"
            className="header__menu-btn"
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          <a href="/" className="header__logo" onClick={goHome}>
            <img src={logo} alt="RecuperAR" className="header__logo-img" />
          </a>

          <nav className="header__nav">
            <a
              href="/"
              className={`header__link${location.pathname === '/' ? ' header__link--active' : ''}`}
              onClick={goHome}
            >
              Inicio
            </a>
            <NavLink to="/catalogo" className={({ isActive }) => `header__link${isActive ? ' header__link--active' : ''}`}>
              Catálogo
            </NavLink>
            <NavLink to="/quienes-somos" className={({ isActive }) => `header__link${isActive ? ' header__link--active' : ''}`}>
              Quiénes Somos
            </NavLink>
            <a href="/#contacto" className="header__link" onClick={handleContact}>Contacto</a>
          </nav>

          <Link to="/carrito" className={`header__cart${location.pathname === '/carrito' ? ' header__cart--active' : ''}${cartBump ? ' header__cart--bump' : ''}`}>
            <span className="material-symbols-outlined">shopping_cart</span>
            {count > 0 && <span className={`header__cart-badge${cartBump ? ' header__cart-badge--pulse' : ''}`}>{count}</span>}
          </Link>
        </div>
      </header>

      <div
        className={`mobile-drawer__backdrop${menuOpen ? ' is-open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      <aside className={`mobile-drawer${menuOpen ? ' is-open' : ''}`} aria-hidden={!menuOpen}>
        <div className="mobile-drawer__head">
          <img src={logo} alt="RecuperAR" className="mobile-drawer__logo" />
          <button
            type="button"
            className="mobile-drawer__close"
            aria-label="Cerrar menú"
            onClick={() => setMenuOpen(false)}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <nav className="mobile-drawer__nav">
          <a
            href="/"
            className={`mobile-drawer__link${location.pathname === '/' ? ' mobile-drawer__link--active' : ''}`}
            onClick={goHome}
          >
            <span className="material-symbols-outlined">home</span>
            Inicio
          </a>
          <NavLink
            to="/catalogo"
            className={({ isActive }) => `mobile-drawer__link${isActive ? ' mobile-drawer__link--active' : ''}`}
          >
            <span className="material-symbols-outlined">grid_view</span>
            Catálogo
          </NavLink>
          <NavLink
            to="/quienes-somos"
            className={({ isActive }) => `mobile-drawer__link${isActive ? ' mobile-drawer__link--active' : ''}`}
          >
            <span className="material-symbols-outlined">groups</span>
            Quiénes Somos
          </NavLink>
          <NavLink
            to="/carrito"
            className={({ isActive }) => `mobile-drawer__link${isActive ? ' mobile-drawer__link--active' : ''}`}
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            Carrito
            {count > 0 && <span className="mobile-drawer__badge">{count}</span>}
          </NavLink>
          <a
            href="/#contacto"
            className="mobile-drawer__link"
            onClick={handleContact}
          >
            <span className="material-symbols-outlined">mail</span>
            Contacto
          </a>
        </nav>
        <div className="mobile-drawer__footer">
          <a
            href="https://wa.me/541152210035"
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-drawer__whatsapp"
          >
            <span className="material-symbols-outlined">support_agent</span>
            Hablanos por WhatsApp
          </a>
        </div>
      </aside>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  )
}
