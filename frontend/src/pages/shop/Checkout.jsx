import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../../components/common/Header.jsx'
import Footer from '../../components/common/Footer.jsx'
import PaymentModal, { PaymentSuccessModal } from '../../components/checkout/PaymentModal.jsx'
import { useCart } from '../../context/CartContext.jsx'
import { createOrderWithReceipt } from '../../api/orders.js'
import { formatPrice } from '../../utils/formatPrice.js'
import { useScrollAnimation } from '../../hooks/useScrollAnimation.js'
import { getImageUrl } from '../../utils/getImageUrl.js'
import '../../styles/catalog.css'
import '../../styles/checkout.css'

const initialForm = {
  name: '', email: '', phone: '',
  address: '', city: '', province: '', postal_code: '',
}

export default function Checkout() {
  const { items, total, count, clearCart } = useCart()
  const navigate = useNavigate()
  const [form, setForm]                   = useState(initialForm)
  const [paymentMethod, setPaymentMethod] = useState('transfer')
  const [loading, setLoading]             = useState(false)
  const [error, setError]                 = useState('')
  const [modalOpen, setModalOpen]         = useState(false)
  const [successId, setSuccessId]         = useState(null)

  useEffect(() => {
    if (items.length === 0 && !successId) navigate('/carrito', { replace: true })
  }, [items.length, navigate, successId])

  useScrollAnimation([items])

  const setField = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    // Solo abre el modal — la orden se crea cuando se confirma con comprobante
    setModalOpen(true)
  }

  const handleConfirmPayment = async (receiptFile) => {
    setLoading(true)
    setError('')

    const res = await createOrderWithReceipt(
      {
        ...form,
        payment_method: paymentMethod,
        items: items.map(i => ({ variant_id: i.variant_id, quantity: i.quantity })),
      },
      receiptFile
    )

    if (res.success) {
      const orderId = res.data.order_id
      clearCart()
      setSuccessId(orderId)
      setModalOpen(false)
    } else {
      setError(res.error || 'Error al procesar la orden')
      setLoading(false)
    }
  }

  if (items.length === 0 && !successId) return null

  if (successId) {
    return (
      <div className="checkout-page">
        <Header />
        <PaymentSuccessModal open orderId={successId} />
        <Footer />
      </div>
    )
  }

  const subtotal = total / 1.21
  const iva      = total - subtotal

  return (
    <div className="checkout-page">
      <Header />

      <div className="checkout-orb checkout-orb--1" />
      <div className="checkout-orb checkout-orb--2" />

      <main className="checkout-main">
        <section className="checkout-header" data-animate="fade-up">
          <div className="checkout-header__row">
            <button
              type="button"
              className="checkout-back"
              aria-label="Volver"
              onClick={() => navigate(-1)}
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="checkout-header__title">Finalizar compra</h1>
          </div>
          <p className="checkout-header__subtitle">
            Completá tus datos para que coordinemos el envío.
          </p>
        </section>

        <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
          {/* Order summary + total */}
          <section className="checkout-summary-grid">
            <div className="checkout-card" data-animate="fade-up">
              <h2 className="checkout-card__title">
                <span className="material-symbols-outlined">receipt_long</span>
                Resumen del pedido
              </h2>
              <div className="summary-items">
                {items.map(it => (
                  <div key={it.variant_id} className="summary-item">
                    <div className="summary-item__left">
                      <div className="summary-item__img">
                        {it.image
                          ? <img src={getImageUrl(it.image)} alt={it.name} />
                          : <span className="material-symbols-outlined">image</span>
                        }
                      </div>
                      <div>
                        <div className="summary-item__name">{it.name}</div>
                        <div className="summary-item__meta">
                          {it.size ? `Talle ${it.size} · ` : ''}Cantidad: {it.quantity}
                        </div>
                      </div>
                    </div>
                    <span className="summary-item__price">{formatPrice(it.price * it.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="checkout-total-card" data-animate="fade-up" data-delay="100">
              <span className="checkout-total-card__label">Total a pagar</span>
              <span className="checkout-total-card__amount">{formatPrice(total)}</span>
              <div className="checkout-total-card__divider" />
              <div className="checkout-total-card__row">
                <span>Subtotal (sin IVA)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="checkout-total-card__row">
                <span>IVA (21%)</span>
                <span>{formatPrice(iva)}</span>
              </div>
              <div className="checkout-total-card__row checkout-total-card__row--free">
                <span>Envío</span>
                <span>Gratis</span>
              </div>
            </div>
          </section>

          {/* Forms */}
          <section className="checkout-form-grid">
            {/* Left column: contact + shipping */}
            <div className="form-col">
              <div className="checkout-card" data-animate="fade-up">
                <h3 className="checkout-card__title">
                  <span className="material-symbols-outlined">person</span>
                  Información de contacto
                </h3>
                <div className="form-col" style={{ gap: '0.875rem' }}>
                  <div className="field">
                    <label className="field__label field__label--required">Nombre completo</label>
                    <input
                      className="field__input"
                      type="text"
                      placeholder="Ej. Juan Pérez"
                      value={form.name}
                      onChange={setField('name')}
                      required
                      autoComplete="name"
                    />
                  </div>
                  <div className="field-grid-2">
                    <div className="field">
                      <label className="field__label field__label--required">Correo electrónico</label>
                      <input
                        className="field__input"
                        type="email"
                        placeholder="juan@email.com"
                        value={form.email}
                        onChange={setField('email')}
                        required
                        autoComplete="email"
                      />
                    </div>
                    <div className="field">
                      <label className="field__label field__label--required">Teléfono</label>
                      <input
                        className="field__input"
                        type="tel"
                        placeholder="+54 9 11 1234-5678"
                        value={form.phone}
                        onChange={setField('phone')}
                        required
                        autoComplete="tel"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="checkout-card" data-animate="fade-up" data-delay="80">
                <h3 className="checkout-card__title">
                  <span className="material-symbols-outlined">local_shipping</span>
                  Dirección de envío
                </h3>
                <div className="form-col" style={{ gap: '0.875rem' }}>
                  <div className="field">
                    <label className="field__label field__label--required">Dirección</label>
                    <input
                      className="field__input"
                      type="text"
                      placeholder="Av. Olazábal 1515"
                      value={form.address}
                      onChange={setField('address')}
                      required
                      autoComplete="street-address"
                    />
                  </div>
                  <div className="field-grid-2">
                    <div className="field">
                      <label className="field__label field__label--required">Ciudad</label>
                      <input
                        className="field__input"
                        type="text"
                        placeholder="CABA"
                        value={form.city}
                        onChange={setField('city')}
                        required
                        autoComplete="address-level2"
                      />
                    </div>
                    <div className="field">
                      <label className="field__label field__label--required">Código Postal</label>
                      <input
                        className="field__input"
                        type="text"
                        placeholder="1428"
                        value={form.postal_code}
                        onChange={setField('postal_code')}
                        required
                        autoComplete="postal-code"
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label className="field__label field__label--required">Provincia</label>
                    <input
                      className="field__input"
                      type="text"
                      placeholder="Buenos Aires"
                      value={form.province}
                      onChange={setField('province')}
                      required
                      autoComplete="address-level1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right column: payment */}
            <div className="form-col">
              <div className="checkout-card" data-animate="fade-up" data-delay="120">
                <h3 className="checkout-card__title">
                  <span className="material-symbols-outlined">payments</span>
                  Método de pago
                </h3>
                <div className="payment-options">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value="transfer"
                      checked={paymentMethod === 'transfer'}
                      onChange={e => setPaymentMethod(e.target.value)}
                    />
                    <div className="payment-option__main">
                      <div className="payment-option__icon">
                        <span className="material-symbols-outlined">account_balance</span>
                      </div>
                      <div>
                        <div className="payment-option__title">Transferencia Bancaria</div>
                      </div>
                    </div>
                    <div className="payment-option__radio" />
                  </label>

                  <label className="payment-option payment-option--disabled">
                    <input type="radio" name="payment" value="mercadopago" disabled />
                    <div className="payment-option__main">
                      <div className="payment-option__icon">
                        <span className="material-symbols-outlined">wallet</span>
                      </div>
                      <div>
                        <div className="payment-option__title">Mercado Pago</div>
                        <div className="payment-option__sub">Próximamente</div>
                      </div>
                    </div>
                    <div className="payment-option__radio" />
                  </label>
                </div>

                <p className="payment-note">
                  Te vamos a enviar los datos bancarios por email cuando finalices la orden, para que puedas hacer la transferencia.
                </p>

                <div className="security-card">
                  <span className="material-symbols-outlined">verified_user</span>
                  <p className="security-card__text">
                    Tus datos viajan por una conexión segura. Solo los usamos para procesar tu pedido.
                  </p>
                </div>
              </div>

              {/* Final action — debajo de Método de pago */}
              <div className="checkout-final" data-animate="fade-up">
                {error && <p className="checkout-final__error">{error}</p>}

                <button type="submit" className="checkout-final__btn" disabled={loading}>
                  <span className="material-symbols-outlined">shopping_cart_checkout</span>
                  {loading ? 'Procesando…' : 'Finalizar Compra'}
                </button>

                <div className="checkout-final__help">
                  <button
                    type="button"
                    className="checkout-final__help-item"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    <span className="material-symbols-outlined">receipt_long</span>
                    Ver Resumen
                  </button>
                  <a
                    href="https://wa.me/541152210035"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="checkout-final__help-item"
                  >
                    <span className="material-symbols-outlined">help_outline</span>
                    Necesito Ayuda
                  </a>
                </div>
              </div>
            </div>
          </section>
        </form>
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

      <PaymentModal
        open={modalOpen}
        total={total}
        loading={loading}
        error={error}
        onClose={() => { setModalOpen(false); setError('') }}
        onConfirm={handleConfirmPayment}
      />
    </div>
  )
}
