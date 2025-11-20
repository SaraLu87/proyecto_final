/**
 * COMPONENTE: USER ROUTE
 *
 * Componente de protección de rutas para usuarios regulares
 * - Verifica que el usuario esté autenticado
 * - Verifica que el rol sea 'Usuario' (no admin)
 * - Redirige a login-usuario si no está autenticado
 */

import { Navigate } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';

const UserRoute = ({ children }) => {
  const { estaAutenticado, cargando } = useUserAuth();

  // Mostrar un loader mientras se verifica la sesión
  if (cargando) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2F7AD9, #52E36A)'
      }}>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #e5e7eb',
            borderTopColor: '#2F7AD9',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ margin: 0, color: '#1C3A63', fontWeight: 600 }}>
            Verificando sesión...
          </p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Si está autenticado, renderizar el componente hijo
  // Si no, redirigir a login de usuario
  return estaAutenticado() ? children : <Navigate to="/login-usuario" replace />;
};

export default UserRoute;
