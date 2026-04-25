const API = import.meta.env.VITE_API_URL

export const createOrder = async (data) => {
  const res = await fetch(`${API}/orders/create.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export const createOrderWithReceipt = async (data, receiptFile) => {
  const fd = new FormData()
  Object.entries(data).forEach(([k, v]) => {
    if (k === 'items') fd.append('items', JSON.stringify(v))
    else fd.append(k, v)
  })
  fd.append('receipt', receiptFile)

  const res = await fetch(`${API}/orders/create.php`, {
    method: 'POST',
    body: fd,
  })
  return res.json()
}

export const getOrder = async (id) => {
  const res = await fetch(`${API}/orders/show.php?id=${id}`)
  return res.json()
}

export const getOrders = async (token, status = '') => {
  const query = status ? `?status=${status}` : ''
  const res = await fetch(`${API}/orders/index.php${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}

export const updateOrderStatus = async (id, status, token) => {
  const res = await fetch(`${API}/orders/update_status.php?id=${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status }),
  })
  return res.json()
}
