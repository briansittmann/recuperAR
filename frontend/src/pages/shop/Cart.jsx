import { Link } from 'react-router-dom'
import Header from '../../components/common/Header.jsx'
import Footer from '../../components/common/Footer.jsx'
import CartItem from '../../components/shop/CartItem.jsx'
import { useCart } from '../../context/CartContext.jsx'
import { formatPrice } from '../../utils/formatPrice.js'
import { useScrollAnimation } from '../../hooks/useScrollAnimation.js'
import '../../styles/catalog.css'
import '../../styles/cart.css'

export default function Cart() {
  const { items, total, count } = useCart()

  useScrollAnimation([items])

  return (
    <div className="cart-page">
      <Header />

      <main className="cart-main">
        <section className="cart-header" data-animate="fade-up">
          <h1 className="cart-header__title">Tu Carrito</h1>
          <p className="cart-header__subtitle">
            {count === 0
              ? 'Todavía no agregaste productos.'
              : `Tenés ${count} producto${count !== 1 ? 's' : ''} listo${count !== 1 ? 's' : ''} para finalizar.`}
          </p>
        </section>

        {items.length === 0 ? (
          <div className="cart-empty" data-animate="scale-in">
            <div className="cart-empty__icon">
              <span className="material-symbols-outlined">shopping_bag</span>
            </div>
            <h2 className="cart-empty__title">Tu carrito está vacío</h2>
            <p className="cart-empty__text">
              Explorá nuestro catálogo y encontrá el equipo ideal para vos.
            </p>
            <Link to="/catalogo" className="btn btn--primary">
              <span className="material-symbols-outlined">grid_view</span>
              Ver catálogo
            </Link>
          </div>
        ) : (
          <div className="cart-grid">
            {/* Items */}
            <div className="cart-items">
              {items.map((item, i) => (
                <div key={item.variant_id} data-animate="fade-up" data-delay={i * 70}>
                  <CartItem item={item} />
                </div>
              ))}
              <Link to="/catalogo" className="cart-add-more" data-animate="fade-up">
                <span className="material-symbols-outlined">add_circle</span>
                <span className="cart-add-more__text">Agregar más productos</span>
              </Link>
            </div>

            {/* Summary */}
            <aside className="cart-aside">
              <div className="cart-summary" data-animate="fade-up" data-delay="100">
                <h3 className="cart-summary__title">Resumen del pedido</h3>
                <div className="cart-summary__rows">
                  <div className="cart-summary__row">
                    <span>Subtotal</span>
                    <span className="cart-summary__row-value">{formatPrice(total)}</span>
                  </div>
                  <div className="cart-summary__row">
                    <span>Envío</span>
                    <span className="cart-summary__free">Gratis a todo AMBA</span>
                  </div>
                </div>
                <div className="cart-summary__divider" />
                <div className="cart-summary__total">
                  <span className="cart-summary__total-label">Total</span>
                  <div className="cart-summary__total-amount">
                    <p className="cart-summary__total-cap">Precio final</p>
                    <p className="cart-summary__total-value">{formatPrice(total)}</p>
                  </div>
                </div>
                <Link to="/checkout" className="cart-summary__cta">
                  <span className="material-symbols-outlined">account_balance_wallet</span>
                  Finalizar Pedido
                  <span className="material-symbols-outlined cart-summary__cta-arrow">chevron_right</span>
                </Link>
                <p className="cart-summary__safe">
                  <span className="material-symbols-outlined">verified_user</span>
                  Pago seguro garantizado por RecuperAR
                </p>
              </div>

              <div className="cart-info-card" data-animate="fade-up" data-delay="180">
                <div className="cart-info-card__icon">
                  <span className="material-symbols-outlined">local_shipping</span>
                </div>
                <div>
                  <div className="cart-info-card__title">Envío gratis a todo el AMBA</div>
                  <p className="cart-info-card__text">
                    Coordinamos el envío con vos al confirmar el pedido. También podés retirar en Av. Olazábal 1515, CABA.
                  </p>
                </div>
              </div>
            </aside>
          </div>
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
        <Link to="/catalogo" className="mobile-bottom-nav__item">
          <span className="material-symbols-outlined">grid_view</span>
          <span>Catálogo</span>
        </Link>
        <Link to="/carrito" className="mobile-bottom-nav__item mobile-bottom-nav__item--active">
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

      <Footer />
    </div>
  )
}
