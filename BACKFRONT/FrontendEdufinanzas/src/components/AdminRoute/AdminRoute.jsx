/**
 * Componente AdminRoute
 * Protege rutas que solo pueden acceder administradores
 * Redirige al login si no está autenticado o a temas si no es admin
 */
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const AdminRoute = ({ children }) => {
  const { estaAutenticado, esAdmin, loading } = useAuth()

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

  // Si está autenticado pero no es admin, redirigir a temas
  if (!esAdmin()) {
    return <Navigate to="/temas" replace />
  }

  // Si es admin, mostrar el contenido
  return children
}

export default AdminRoute
