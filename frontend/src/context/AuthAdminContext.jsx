import { createContext, useContext, useState } from 'react'
import { getToken, setToken, removeToken } from '../utils/storage.js'

const AuthAdminContext = createContext(null)

export function AuthAdminProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken())

  const loginAdmin = (newToken) => {
    setToken(newToken)
    setTokenState(newToken)
  }

  const logoutAdmin = () => {
    removeToken()
    setTokenState(null)
  }

  return (
    <AuthAdminContext.Provider value={{ token, loginAdmin, logoutAdmin, isAuthenticated: !!token }}>
      {children}
    </AuthAdminContext.Provider>
  )
}

export const useAuthAdmin = () => useContext(AuthAdminContext)
