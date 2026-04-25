const API = import.meta.env.VITE_API_URL

export const getProducts = async (params = {}) => {
  const query = new URLSearchParams(params).toString()
  const res = await fetch(`${API}/products/index.php${query ? '?' + query : ''}`)
  return res.json()
}

export const getProduct = async (id) => {
  const res = await fetch(`${API}/products/show.php?id=${id}`)
  return res.json()
}

export const createProduct = async (formData, token) => {
  const res = await fetch(`${API}/products/create.php`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  return res.json()
}

export const updateProduct = async (id, formData, token) => {
  const res = await fetch(`${API}/products/update.php?id=${id}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  return res.json()
}

export const deleteProduct = async (id, token) => {
  const res = await fetch(`${API}/products/delete.php?id=${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}

export const createVariant = async (data, token) => {
  const res = await fetch(`${API}/variants/create.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
  return res.json()
}

export const updateVariant = async (id, data, token) => {
  const res = await fetch(`${API}/variants/update.php?id=${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
  return res.json()
}

export const deleteVariant = async (id, token) => {
  const res = await fetch(`${API}/variants/delete.php?id=${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}

// ── Product images (galería) ────────────────────────────────────────────
export const addProductImages = async (productId, files, token) => {
  const fd = new FormData()
  fd.append('product_id', productId)
  Array.from(files).forEach(f => fd.append('images[]', f))
  const res = await fetch(`${API}/product_images/create.php`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  })
  return res.json()
}

export const deleteProductImage = async (id, token) => {
  const res = await fetch(`${API}/product_images/delete.php?id=${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}

export const reorderProductImages = async (orderIds, token) => {
  const res = await fetch(`${API}/product_images/reorder.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ order: orderIds }),
  })
  return res.json()
}
