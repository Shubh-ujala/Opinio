import { create } from 'zustand'
import api from '../api/axios.js'

const useAuthStore = create((set) => ({
  user:    null,
  loading: true,

  // Call this once on app start — checks if token exists
  initAuth: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      set({ loading: false })
      return
    }
    try {
      const res = await api.get('/auth/me')
      set({ user: res.data.user, loading: false })
    } catch {
      localStorage.removeItem('token')
      set({ user: null, loading: false })
    }
  },

  login: (token, userData) => {
    localStorage.setItem('token', token)
    set({ user: userData })
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null })
  }
}))

export default useAuthStore