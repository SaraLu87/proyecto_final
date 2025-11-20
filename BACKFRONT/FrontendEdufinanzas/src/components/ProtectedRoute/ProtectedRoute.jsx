/**
 * Componente ProtectedRoute
 * Protege rutas que requieren autenticación
 * Redirige al login si el usuario no está autenticado
 */
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { estaAutenticado, loading } = useAuth()

  // Mostrar indicador de carga mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    )
  }

  // Si no está autenticado, redirigir al login
  if (!estaAutenticado()) {
    return <Navigate to="/login" replace />
  }

  // Si está autenticado, mostrar el contenido
  return children
}

export default ProtectedRoute
