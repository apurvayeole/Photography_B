import { Routes, Route, Navigate } from 'react-router-dom'
import { Providers } from '@/components/canvas/Providers'
import Home          from './pages/home'
import AdminLogin    from './pages/admin/Login'
import Dashboard     from './pages/admin/Dashboard'
import ProtectedRoute from './components/admin/ProtectedRoute'

export default function App() {
  return (
    <div className="h-full bg-white dark:bg-black">
      <Providers>
        <Routes>
          {/* public portfolio — no auth UI exposed here */}
          <Route path="/" element={<Home />} />

          {/* hidden admin portal */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Providers>
    </div>
  )
}
