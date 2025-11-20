/**
 * COMPONENTE: USER HEADER
 *
 * Barra de navegación superior para usuarios regulares
 * - Muestra logo y nombre de la aplicación
 * - Muestra cantidad de monedas del usuario
 * - Botón "Mi Perfil" para ver/editar perfil
 * - Botón "Cerrar Sesión"
 * - Diseño responsivo con gradiente azul-verde
 */

import { useUserAuth } from '../../context/UserAuthContext';
import { useNavigate } from 'react-router-dom';
import './UserHeader.css';

const UserHeader = () => {
  const { perfil, logout } = useUserAuth();
  const navigate = useNavigate();

  /**
   * Manejar cierre de sesión
   */
  const handleLogout = () => {
    logout();
    navigate('/login-usuario');
  };

  /**
   * Navegar a la página de perfil
   */
  const handlePerfil = () => {
    navigate('/usuario/perfil');
  };

  return (
    <header className="header-user">
      <div className="header-container">
        {/* Logo y nombre de la aplicación */}
        <div className="header-logo">
          <div className="logo-circle">
            <span className="logo-icon">$</span>
          </div>
          <h1 className="header-title">EduFinanzas</h1>
        </div>

        {/* Información del usuario y acciones */}
        <div className="header-actions">
          {/* Monedas del usuario */}
          {perfil && (
            <div className="user-coins">
              <span className="coin-icon">🪙</span>
              <span className="coin-amount">{perfil.monedas || 0}</span>
              <span className="coin-label">monedas</span>
            </div>
          )}

          {/* Botón Mi Perfil */}
          <button className="btn-profile" onClick={handlePerfil}>
            <span className="profile-icon">👤</span>
            <span className="profile-text">Mi Perfil</span>
          </button>

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

export default UserHeader;
