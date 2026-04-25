// Convierte un nombre en un slug URL-friendly.
// Ej: "Silla Ultraligera X3" → "silla-ultraligera-x3"
export function slugify(text) {
  if (!text) return ''
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // quita acentos
    .replace(/&/g, '-y-')
    .replace(/[^a-z0-9]+/g, '-') // todo lo no alfanumérico → guion
    .replace(/^-+|-+$/g, '')     // quita guiones de los extremos
    .replace(/-{2,}/g, '-')      // colapsa guiones repetidos
}

// Construye el path de un producto: /producto/<slug>-<id>
// Si no hay nombre, devuelve /producto/<id> como fallback.
export function productPath(product) {
  if (!product?.id) return '#'
  const slug = slugify(product.name)
  return slug ? `/producto/${slug}-${product.id}` : `/producto/${product.id}`
}

// Extrae el ID de un slug. Acepta:
// - "4"                          → 4   (URLs viejas)
// - "silla-ultraligera-x3-4"     → 4   (URLs con slug)
// - cualquier formato con número al final
export function parseProductId(slug) {
  if (!slug) return null
  const m = String(slug).match(/(\d+)$/)
  return m ? parseInt(m[1], 10) : null
}
