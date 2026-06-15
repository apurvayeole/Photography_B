import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import type { ReactNode } from 'react'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAdmin = useAuthStore((s) => s.isAdmin)
  if (!isAdmin) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}
