/**
 * Componente principal de la aplicación
 * Define las rutas y la estructura general de navegación
 */
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import AdminRoute from './components/AdminRoute/AdminRoute'

// Páginas públicas
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'

// Páginas protegidas (requieren autenticación)
import Temas from './pages/Temas/Temas'
import TemasRetos from './pages/TemasRetos/TemasRetos'
import Retos from './pages/Retos/Retos'
import PerfilUsuario from './pages/PerfilUsuario/PerfilUsuario'

// Panel de Administrador
import AdminPanel from './pages/Admin/AdminPanel'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />

        {/* Rutas protegidas - requieren autenticación */}
        <Route
          path="/temas"
          element={
            <ProtectedRoute>
              <Temas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/temas/:idTema/retos"
          element={
            <ProtectedRoute>
              <TemasRetos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/retos/:idReto"
          element={
            <ProtectedRoute>
              <Retos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <PerfilUsuario />
            </ProtectedRoute>
          }
        />

        {/* Rutas de administrador */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />

        {/* Ruta por defecto - redirige a home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
