export const getToken    = ()      => localStorage.getItem('admin_token')
export const setToken    = (token) => localStorage.setItem('admin_token', token)
export const removeToken = ()      => localStorage.removeItem('admin_token')
