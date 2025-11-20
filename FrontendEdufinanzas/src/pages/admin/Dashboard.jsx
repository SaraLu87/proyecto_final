/**
 * PÁGINA: DASHBOARD ADMINISTRADOR
 *
 * Panel principal de administración
 * - Tarjetas con estadísticas generales
 * - Resumen de datos de la plataforma
 * - Enlaces rápidos a cada módulo
 * - Diseño moderno y responsivo
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  obtenerUsuarios,
  obtenerTemas,
  obtenerRetos,
  obtenerTips
} from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
  // Estados para las estadísticas
  const [estadisticas, setEstadisticas] = useState({
    totalUsuarios: 0,
    totalTemas: 0,
    totalRetos: 0,
    totalTips: 0,
  });

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  /**
   * Cargar estadísticas al montar el componente
   */
  useEffect(() => {
    cargarEstadisticas();
  }, []);

  /**
   * Función para cargar todas las estadísticas
   */
  const cargarEstadisticas = async () => {
    try {
      setCargando(true);
      setError('');

      // Realizar todas las peticiones en paralelo
      const [usuarios, temas, retos, tips] = await Promise.all([
        obtenerUsuarios(),
        obtenerTemas(),
        obtenerRetos(),
        obtenerTips(),
      ]);

      // Actualizar estadísticas
      setEstadisticas({
        totalUsuarios: usuarios.length || 0,
        totalTemas: temas.length || 0,
        totalRetos: retos.length || 0,
        totalTips: tips.length || 0,
      });
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
      setError('Error al cargar las estadísticas');
    } finally {
      setCargando(false);
    }
  };

  /**
   * Renderizar loader mientras carga
   */
  if (cargando) {
    return (
      <div className="dashboard-container">
        <div className="loader">
          <div className="spinner"></div>
          <p>Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  /**
   * Renderizar error si ocurre
   */
  if (error) {
    return (
      <div className="dashboard-container">
        <div className="alert alert-error">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Título de bienvenida */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Panel de Administración</h1>
        <p className="dashboard-subtitle">
          Bienvenido al sistema de gestión de EduFinanzas
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="stats-grid">
        {/* Tarjeta de Usuarios */}
        <Link to="/admin/usuarios" className="stat-card stat-card-usuarios">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3 className="stat-number">{estadisticas.totalUsuarios}</h3>
            <p className="stat-label">Usuarios</p>
          </div>
          <div className="stat-arrow">→</div>
        </Link>

        {/* Tarjeta de Temas */}
        <Link to="/admin/temas" className="stat-card stat-card-temas">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3 className="stat-number">{estadisticas.totalTemas}</h3>
            <p className="stat-label">Temas</p>
          </div>
          <div className="stat-arrow">→</div>
        </Link>

        {/* Tarjeta de Retos */}
        <Link to="/admin/retos" className="stat-card stat-card-retos">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3 className="stat-number">{estadisticas.totalRetos}</h3>
            <p className="stat-label">Retos</p>
          </div>
          <div className="stat-arrow">→</div>
        </Link>

        {/* Tarjeta de Tips */}
        <Link to="/admin/tips" className="stat-card stat-card-tips">
          <div className="stat-icon">💡</div>
          <div className="stat-content">
            <h3 className="stat-number">{estadisticas.totalTips}</h3>
            <p className="stat-label">Tips</p>
          </div>
          <div className="stat-arrow">→</div>
        </Link>
      </div>

      {/* Accesos rápidos */}
      <div className="quick-actions">
        <h2 className="section-title">Acciones Rápidas</h2>

        <div className="actions-grid">
          {/* Gestión de Usuarios */}
          <div className="action-card">
            <div className="action-icon">👥</div>
            <h3 className="action-title">Gestión de Usuarios</h3>
            <p className="action-description">
              Administra usuarios, roles y permisos del sistema
            </p>
            <Link to="/admin/usuarios" className="action-btn">
              Ver Usuarios
            </Link>
          </div>

          {/* Gestión de Contenido */}
          <div className="action-card">
            <div className="action-icon">📝</div>
            <h3 className="action-title">Gestión de Contenido</h3>
            <p className="action-description">
              Crea y edita temas educativos para la plataforma
            </p>
            <Link to="/admin/temas" className="action-btn">
              Ver Temas
            </Link>
          </div>

          {/* Gestión de Retos */}
          <div className="action-card">
            <div className="action-icon">🎯</div>
            <h3 className="action-title">Gestión de Retos</h3>
            <p className="action-description">
              Crea desafíos y preguntas para los usuarios
            </p>
            <Link to="/admin/retos" className="action-btn">
              Ver Retos
            </Link>
          </div>

          {/* Gestión de Tips */}
          <div className="action-card">
            <div className="action-icon">💡</div>
            <h3 className="action-title">Tips Periódicas</h3>
            <p className="action-description">
              Administra tips financieras para los usuarios
            </p>
            <Link to="/admin/tips" className="action-btn">
              Ver Tips
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
