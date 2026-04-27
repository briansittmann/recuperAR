import { useState, useEffect, useRef } from 'react'
import '../../styles/reviews-carousel.css'

const REVIEWS = [
  {
    id: 1,
    name: 'María G.',
    time: 'Hace 2 semanas',
    rating: 5,
    text: 'Excelente atención y productos de muy buena calidad. Me ayudaron a encontrar exactamente lo que necesitaba para mi mamá. Muy recomendables.',
  },
  {
    id: 2,
    name: 'Carlos R.',
    time: 'Hace 1 mes',
    rating: 5,
    text: 'El mantenimiento de la silla de ruedas fue rápido y profesional. El equipo técnico es muy amable y explica todo con detalle.',
  },
  {
    id: 3,
    name: 'Sofía M.',
    time: 'Hace 3 días',
    rating: 5,
    text: 'Servicio rápido y eficiente. Se nota que les importa el bienestar de sus clientes. Los productos son de primera calidad.',
  },
  {
    id: 4,
    name: 'Roberto L.',
    time: 'Hace 2 meses',
    rating: 5,
    text: 'Compré una silla ultraligera y superó todas mis expectativas. El asesoramiento fue personalizado y muy profesional.',
  },
  {
    id: 5,
    name: 'Ana P.',
    time: 'Hace 1 semana',
    rating: 5,
    text: 'Muy buena experiencia de compra. El producto llegó en perfecto estado y el servicio post-venta es excelente.',
  },
]

const SWIPE_THRESHOLD = 60 // px

export default function ReviewsCarousel() {
  const [current, setCurrent] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const timerRef = useRef(null)
  const startXRef = useRef(0)
  const draggingRef = useRef(false)

  const startTimer = () => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % REVIEWS.length)
    }, 5000)
  }

  useEffect(() => {
    startTimer()
    return () => clearInterval(timerRef.current)
  }, [])

  const goTo = (index) => {
    setCurrent((index + REVIEWS.length) % REVIEWS.length)
    startTimer()
  }

  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return
    draggingRef.current = true
    setDragging(true)
    startXRef.current = e.clientX
    clearInterval(timerRef.current)
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }

  const handlePointerMove = (e) => {
    if (!draggingRef.current) return
    setDragOffset(e.clientX - startXRef.current)
  }

  const endDrag = (e) => {
    if (!draggingRef.current) return
    draggingRef.current = false
    const offset = (e.clientX ?? startXRef.current) - startXRef.current
    setDragging(false)
    setDragOffset(0)
    if (offset > SWIPE_THRESHOLD)        goTo(current - 1)
    else if (offset < -SWIPE_THRESHOLD)  goTo(current + 1)
    else                                 startTimer()
  }

  const trackStyle = {
    transform: dragging
      ? `translateX(calc(-${current * 100}% + ${dragOffset}px))`
      : `translateX(-${current * 100}%)`,
    transition: dragging ? 'none' : undefined,
  }

  return (
    <div className="reviews-carousel">
      <div
        className={`reviews-carousel__viewport${dragging ? ' is-dragging' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="reviews-carousel__track" style={trackStyle}>
          {REVIEWS.map(review => (
            <div key={review.id} className="reviews-carousel__item">
              <div className="glass-card review-card">
                <div className="review-card__header">
                  <div className="review-card__avatar">{review.name.charAt(0)}</div>
                  <div>
                    <p className="review-card__name">{review.name}</p>
                    <p className="review-card__time">{review.time}</p>
                  </div>
                </div>
                <div className="review-card__stars">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <span key={i} className="material-symbols-outlined review-card__star">star</span>
                  ))}
                </div>
                <p className="review-card__text">"{review.text}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="reviews-carousel__btn reviews-carousel__btn--prev" onClick={() => goTo(current - 1)} aria-label="Anterior">
        <span className="material-symbols-outlined">chevron_left</span>
      </button>
      <button className="reviews-carousel__btn reviews-carousel__btn--next" onClick={() => goTo(current + 1)} aria-label="Siguiente">
        <span className="material-symbols-outlined">chevron_right</span>
      </button>

      <div className="reviews-carousel__dots">
        {REVIEWS.map((_, i) => (
          <button
            key={i}
            className={`reviews-carousel__dot${i === current ? ' reviews-carousel__dot--active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Reseña ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
