import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../../components/common/Header.jsx'
import Footer from '../../components/common/Footer.jsx'
import ReviewsCarousel from '../../components/home/ReviewsCarousel.jsx'
import ContactCard from '../../components/common/ContactCard.jsx'
import { getProducts } from '../../api/products.js'
import { formatPrice } from '../../utils/formatPrice.js'
import { useScrollAnimation } from '../../hooks/useScrollAnimation.js'
import { getImageUrl } from '../../utils/getImageUrl.js'
import { productPath } from '../../utils/slugify.js'
import heroVideo from '../../assets/wheelChairCon.mp4'
import heroPoster from '../../assets/preview-hero.png'
import '../../styles/home.css'

const INFO_CARDS = [
  {
    icon: 'accessibility_new',
    title: 'Productos a Medida',
    desc: 'Asesoramiento personalizado para encontrar el equipo ideal según tus necesidades y estilo de vida.',
  },
  {
    icon: 'verified',
    title: 'Calidad Premium',
    desc: 'Materiales de primera calidad y productos de marcas reconocidas para máxima durabilidad.',
  },
  {
    icon: 'support_agent',
    title: 'Asistencia Técnica',
    desc: 'Soporte especializado y mantenimiento para que nunca dejes de moverte.',
  },
]

export default function Home() {
  const [featured, setFeatured] = useState([])

  useEffect(() => {
    getProducts({}).then(res => {
      if (res.success) setFeatured(res.data.slice(0, 4))
    })
  }, [])

  useScrollAnimation([featured])

  return (
    <div className="home">
      <Header />

      {/* Hero */}
      <section className="hero">
        <video className="hero__video" autoPlay muted loop playsInline poster={heroPoster}>
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="hero__overlay" />
        <div className="hero__content">
          <h1 className="hero__title">Soluciones Médicas con compromiso Humano</h1>
          <p className="hero__subtitle">
            Tecnología y ergonomía premium para que nada detenga tu camino.
            Descubrí la nueva era de la movilidad personalizada.
          </p>
          <div className="hero__actions">
            <Link to="/catalogo" className="btn btn--ghost">Ver Catálogo</Link>
            <a href="#contacto" className="btn btn--ghost">Consultar</a>
          </div>
        </div>
      </section>

      {/* Info cards */}
      <section className="info-cards">
        <div className="container">
          <div className="info-cards__grid">
            {INFO_CARDS.map((card, i) => (
              <div key={card.title} className="glass-card liquid-shadow info-card" data-animate="fade-up" data-delay={i * 120}>
                <span className="material-symbols-outlined info-card__icon">{card.icon}</span>
                <h3 className="info-card__title">{card.title}</h3>
                <p className="info-card__desc">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="featured">
          <div className="container">
            <div className="section-header">
              <div>
                <span className="section-label">Nuestra Selección</span>
                <h2 className="section-title">Productos Destacados</h2>
              </div>
              <Link to="/catalogo" className="section-link">
                Ver todo <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
            <div className="featured__grid">
              {featured.map((product, i) => (
                <Link key={product.id} to={productPath(product)} className="product-card" data-animate="fade-up" data-delay={i * 100}>
                  <div className="product-card__img-wrap">
                    {product.image
                      ? <img src={getImageUrl(product.image)} alt={product.name} className="product-card__img" />
                      : <div className="product-card__img-placeholder"><span className="material-symbols-outlined">image</span></div>
                    }
                  </div>
                  <div className="product-card__body">
                    <h4 className="product-card__name">{product.name}</h4>
                    <div className="product-card__footer">
                      <span className="product-card__price">
                        {product.min_price ? `Desde ${formatPrice(product.min_price)}` : ''}
                      </span>
                      <span className="product-card__cta">
                        <span className="material-symbols-outlined">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Location */}
      <section className="location">
        <div className="container">
          <div className="location__inner">
            <div className="location__map" data-animate="fade-left">
              <iframe
                title="Ubicación RecuperAR"
                src="https://maps.google.com/maps?q=Recuperar+SM+SRL,+Av.+Olaz%C3%A1bal+1515,+Buenos+Aires,+Argentina&output=embed&z=16"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="location__info" data-animate="fade-right" data-delay="100">
              <div>
                <span className="section-label">Dónde estamos</span>
                <h2 className="section-title">Visitanos</h2>
              </div>
              <p className="location__desc">
                Nuestro local está diseñado para que puedas probar los productos y asesorarte con nuestro equipo de expertos.
              </p>
              <div className="location__details">
                <div className="location__detail">
                  <span className="material-symbols-outlined location__detail-icon">location_on</span>
                  <span>Av. Olazábal 1515, C1428 CABA</span>
                </div>
                <div className="location__detail">
                  <span className="material-symbols-outlined location__detail-icon">schedule</span>
                  <span>Lunes a Viernes: 09:00 – 18:00</span>
                </div>
                <div className="location__detail">
                  <span className="material-symbols-outlined location__detail-icon">phone</span>
                  <span>+54 11 5221-0035</span>
                </div>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Google&query_place_id=ChIJNRxBUpc_G2YRGg0V9CIaIlw"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--primary location__btn"
              >
                Cómo llegar
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="reviews">
        <div className="container">
          <div className="reviews__header">
            <h2 className="section-title">Lo que dicen de nosotros</h2>
            <div className="reviews__rating">
              {[1, 2, 3, 4, 5].map(i => (
                <span key={i} className="material-symbols-outlined reviews__star">star</span>
              ))}
              <span className="reviews__score">4.9 / 5 en Google</span>
            </div>
          </div>
          <div data-animate="fade-up" data-delay="100"><ReviewsCarousel /></div>
        </div>
      </section>

      {/* Contact */}
      <section className="contact" id="contacto">
        <div className="container">
          <div className="contact__card" data-animate="scale-in">
            <ContactCard />
          </div>
        </div>
      </section>

      {/* Float buttons */}
      <div className="float-buttons">
        <a href="https://wa.me/541152210035" target="_blank" rel="noopener noreferrer" className="float-btn float-btn--whatsapp" title="WhatsApp">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.235 1.592 5.228 0 9.483-4.256 9.485-9.485.002-5.235-4.262-9.485-9.487-9.485-5.228 0-9.483 4.256-9.485 9.485 0 2.035.566 3.541 1.644 5.22l-.961 3.511 3.569-.928zm10.596-6.703c-.313-.157-1.851-.913-2.138-1.018-.286-.104-.495-.157-.704.157-.209.314-.809 1.018-.992 1.227-.182.209-.364.235-.677.079-1.34-.673-2.222-1.12-3.111-2.651-.235-.404.235-.375.673-1.25.078-.157.039-.294-.02-.411-.059-.117-.495-1.192-.678-1.633-.178-.432-.359-.373-.495-.38l-.421-.008c-.144 0-.379.054-.577.269-.198.214-.756.738-.756 1.8 0 1.062.772 2.088.88 2.232.108.144 1.519 2.319 3.679 3.251 2.16.932 2.16.621 2.551.584.391-.037 1.264-.517 1.442-1.018.178-.501.178-.931.124-1.018-.053-.087-.194-.139-.507-.296z" />
          </svg>
        </a>
        <a href="tel:+541152210035" className="float-btn float-btn--phone" title="Llamar">
          <span className="material-symbols-outlined">call</span>
        </a>
      </div>

      {/* Scroll to top */}
      <div className="scroll-top">
        <button className="scroll-top__btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="material-symbols-outlined">keyboard_arrow_up</span>
          Volver al inicio
        </button>
      </div>

      <Footer />
    </div>
  )
}
