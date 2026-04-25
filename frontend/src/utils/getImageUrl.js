// Convierte un path relativo guardado en la BD (ej. "uploads/product_abc.jpg")
// en la URL absoluta para mostrar la imagen.
// Único lugar donde se construye la URL — si cambia el storage (CDN, S3, etc.)
// solo hay que tocar este archivo.

const API_URL = import.meta.env.VITE_API_URL ?? ''

export function getImageUrl(path) {
  if (!path) return ''
  // Si ya viene una URL absoluta, devolverla tal cual
  if (/^https?:\/\//i.test(path)) return path
  return `${API_URL}/${path.replace(/^\/+/, '')}`
}
