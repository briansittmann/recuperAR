const API = import.meta.env.VITE_API_URL

export const login = async (email, password) => {
  const res = await fetch(`${API}/admin/login.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return res.json()
}
