/**
 * COMPONENTE: SIDEBAR
 *
 * Barra lateral de navegación para el panel de administración
 * - Muestra todas las tablas de la base de datos
 * - Navegación a cada módulo CRUD
 * - Diseño colapsable en móviles
 * - Indicador de sección activa
 */

import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import './Sidebar.css';

const Sidebar = () => {
  // Estado para controlar el menú en móviles
  const [menuAbierto, setMenuAbierto] = useState(false);

  /**
   * Toggle del menú en dispositivos móviles
   */
  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  /**
   * Cerrar menú al hacer click en un enlace (móviles)
   */
  const cerrarMenu = () => {
    if (window.innerWidth <= 768) {
      setMenuAbierto(false);
    }
  };

  return (
    <>
      {/* Botón hamburguesa para móviles */}
      <button className="sidebar-toggle" onClick={toggleMenu}>
        <span className="hamburger-icon">
          {menuAbierto ? '✕' : '☰'}
        </span>
      </button>

      {/* Overlay para cerrar el menú en móviles */}
      {menuAbierto && (
        <div className="sidebar-overlay" onClick={toggleMenu}></div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${menuAbierto ? 'sidebar-open' : ''}`}>
        <div className="sidebar-content">
          {/* Título del sidebar */}
          <div className="sidebar-header">
            <h2 className="sidebar-title">Panel de Control</h2>
          </div>

          {/* Navegación */}
          <nav className="sidebar-nav">
            {/* Dashboard */}
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
              }
              onClick={cerrarMenu}
            >
              <span className="sidebar-icon">📊</span>
              <span className="sidebar-text">Dashboard</span>
            </NavLink>

            {/* Separador */}
            <div className="sidebar-divider">
              <span>Gestión de Contenido</span>
            </div>

            {/* Usuarios */}
            <NavLink
              to="/admin/usuarios"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
              }
              onClick={cerrarMenu}
            >
              <span className="sidebar-icon">👥</span>
              <span className="sidebar-text">Usuarios</span>
            </NavLink>

            {/* Temas */}
            <NavLink
              to="/admin/temas"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
              }
              onClick={cerrarMenu}
            >
              <span className="sidebar-icon">📚</span>
              <span className="sidebar-text">Temas</span>
            </NavLink>

            {/* Retos */}
            <NavLink
              to="/admin/retos"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
              }
              onClick={cerrarMenu}
            >
              <span className="sidebar-icon">🎯</span>
              <span className="sidebar-text">Retos</span>
            </NavLink>

            {/* Tips */}
            <NavLink
              to="/admin/tips"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
              }
              onClick={cerrarMenu}
            >
              <span className="sidebar-icon">💡</span>
              <span className="sidebar-text">Tips Periódicas</span>
            </NavLink>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
