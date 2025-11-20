/**
 * COMPONENTE: ADMIN ROUTE (Ruta Protegida)
 *
 * Componente que protege las rutas del panel de administración
 * - Verifica que el usuario esté autenticado
 * - Verifica que el usuario tenga rol de Administrador
 * - Redirige al login si no cumple los requisitos
 * - Muestra loader mientras verifica la autenticación
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { usuario, cargando, estaAutenticado } = useAuth();

  /**
   * Mostrar loader mientras se verifica la autenticación
   */
  if (cargando) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '1rem'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #e5e7eb',
          borderTopColor: '#2F7AD9',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}></div>
        <p style={{ color: '#475569', fontSize: '1rem' }}>
          Verificando autenticación...
        </p>
      </div>
    );
  }

  /**
   * Si no está autenticado o no es administrador, redirigir al login
   */
  if (!estaAutenticado()) {
    return <Navigate to="/login" replace />;
  }

  /**
   * Si está autenticado y es administrador, renderizar el componente hijo
   */
  return children;
};

export default AdminRoute;
