import { create } from 'zustand'

interface AuthState {
  token: string | null
  isAdmin: boolean
  setToken: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token:   localStorage.getItem('auth_token'),
  isAdmin: !!localStorage.getItem('auth_token'),

  setToken: (token) => {
    localStorage.setItem('auth_token', token)
    set({ token, isAdmin: true })
  },

  logout: () => {
    localStorage.removeItem('auth_token')
    set({ token: null, isAdmin: false })
  },
}))
