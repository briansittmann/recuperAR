import { useEffect } from 'react'

export function useScrollAnimation(deps = []) {
  useEffect(() => {
    const elements = document.querySelectorAll('[data-animate]')

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0
          entry.target.style.setProperty('--anim-delay', `${delay}ms`)
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12 })

    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, deps)
}
