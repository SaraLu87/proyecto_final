/**
 * COMPONENTE: HEADER ADMINISTRATIVO
 *
 * Barra de navegación superior para el panel de administración
 * - Basado en el Header del frontend de usuario pero sin monedas ni perfil
 * - Muestra logo, nombre de la aplicación y nombre del administrador
 * - Botón de cerrar sesión
 * - Diseño responsivo con gradiente azul-verde
 */

import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  /**
   * Manejar cierre de sesión
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header-admin">
      <div className="header-container">
        {/* Logo y nombre de la aplicación */}
        <div className="header-logo">
          <div className="logo-circle">
            <span className="logo-icon">$</span>
          </div>
          <h1 className="header-title">EduFinanzas Admin</h1>
        </div>

        {/* Información del usuario y acciones */}
        <div className="header-actions">
          {/* Nombre del administrador */}
          {usuario && (
            <div className="admin-info">
              <span className="admin-icon">👤</span>
              <span className="admin-name">{usuario.correo}</span>
            </div>
          )}

          {/* Botón de cerrar sesión */}
          <button className="btn-logout" onClick={handleLogout}>
            <span className="logout-icon">🚪</span>
            <span className="logout-text">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
