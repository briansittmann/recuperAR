const API = import.meta.env.VITE_API_URL

export const getCategories = async () => {
  const res = await fetch(`${API}/categories/index.php`)
  return res.json()
}

export const createCategory = async (data, token) => {
  const res = await fetch(`${API}/categories/create.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
  return res.json()
}

export const updateCategory = async (id, data, token) => {
  const res = await fetch(`${API}/categories/update.php?id=${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
  return res.json()
}

export const deleteCategory = async (id, token) => {
  const res = await fetch(`${API}/categories/delete.php?id=${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}
