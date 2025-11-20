/**
 * PÁGINA: DASHBOARD DE USUARIO
 *
 * Panel principal del usuario con:
 * - Tip diario que rota cada 20 minutos
 * - Barra de progreso general del usuario
 * - Cards de temas disponibles con estado (bloqueado/en progreso/completado)
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';
import { obtenerTemas, obtenerTips, obtenerMiProgreso, obtenerProgresoTemas } from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { perfil, recargarPerfil } = useUserAuth();

  // Estados
  const [temas, setTemas] = useState([]);
  const [tips, setTips] = useState([]);
  const [tipActual, setTipActual] = useState(null);
  const [progreso, setProgreso] = useState(null);
  const [progresoTemas, setProgresoTemas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  /**
   * Cargar datos iniciales al montar el componente
   */
  useEffect(() => {
    cargarDatos();
    // Recargar perfil para tener monedas actualizadas
    recargarPerfil();
  }, []);

  /**
   * Configurar rotación de tips cada 20 minutos
   */
  useEffect(() => {
    if (tips.length > 0) {
      // Seleccionar un tip aleatorio al inicio
      seleccionarTipAleatorio();

      // Configurar intervalo de 20 minutos (1200000 ms)
      const intervalo = setInterval(() => {
        seleccionarTipAleatorio();
      }, 1200000); // 20 minutos

      // Limpiar intervalo al desmontar
      return () => clearInterval(intervalo);
    }
  }, [tips]);

  /**
   * Seleccionar un tip aleatorio de la lista
   */
  const seleccionarTipAleatorio = () => {
    if (tips.length > 0) {
      const indiceAleatorio = Math.floor(Math.random() * tips.length);
      setTipActual(tips[indiceAleatorio]);
    }
  };

  /**
   * Cargar todos los datos necesarios
   */
  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError('');

      // Cargar temas, tips, progreso y progreso por temas en paralelo
      const [temasData, tipsData, progresoData, progresoTemasData] = await Promise.all([
        obtenerTemas(),
        obtenerTips(),
        obtenerMiProgreso(),
        obtenerProgresoTemas()
      ]);

      setTemas(temasData);
      setTips(tipsData);
      setProgreso(progresoData);
      setProgresoTemas(progresoTemasData);

    } catch (err) {
      console.error('Error al cargar datos del dashboard:', err);
      setError('Error al cargar los datos. Por favor, intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  /**
   * Navegar a la página de detalle del tema
   */
  const handleVerTema = (idTema) => {
    navigate(`/usuario/tema/${idTema}`);
  };

  /**
   * Determinar el estado de un tema basado en el progreso del usuario
   * - Primer tema: siempre disponible
   * - Siguientes temas: se desbloquean al completar todos los retos del tema anterior
   */
  const obtenerEstadoTema = (tema, indice) => {
    // Buscar el progreso de este tema en los datos del backend
    const progresoDelTema = progresoTemas.find(p => p.id_tema === tema.id_tema);

    // Si el tema está completado (todos los retos completados)
    if (progresoDelTema && progresoDelTema.esta_completado) {
      return 'completado';
    }

    // El primer tema siempre está disponible
    if (indice === 0) return 'disponible';

    // Para los siguientes temas, verificar si el usuario completó TODOS los retos del tema anterior
    const temaAnterior = temas[indice - 1];
    if (!temaAnterior) return 'bloqueado';

    // Buscar el progreso del tema anterior
    const progresoTemaAnterior = progresoTemas.find(p => p.id_tema === temaAnterior.id_tema);

    // El tema está disponible solo si el tema anterior está completado
    if (progresoTemaAnterior && progresoTemaAnterior.esta_completado) {
      return 'disponible';
    }

    // Si el tema anterior no está completado, este tema está bloqueado
    return 'bloqueado';
  };

  // Mostrar loader mientras carga
  if (cargando) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-user">
      <div className="dashboard-container">
        {/* Encabezado */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            ¡Hola, {perfil?.nombre_perfil || 'Usuario'}! 👋
          </h1>
          <p className="dashboard-subtitle">
            Continúa aprendiendo sobre finanzas y gana más monedas
          </p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="alert-error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Tip del día */}
        {tipActual && (
          <div className="tip-card">
            <div className="tip-header">
              <span className="tip-icon">💡</span>
              <h2 className="tip-title">Tip del Momento</h2>
            </div>
            <h3 className="tip-name">{tipActual.nombre}</h3>
            <p className="tip-description">{tipActual.descripcion}</p>
            <p className="tip-info">
              Este tip cambia cada 20 minutos
            </p>
          </div>
        )}

        {/* Barra de progreso general */}
        {progreso && (
          <div className="progress-card">
            <div className="progress-header">
              <h2 className="progress-title">Tu Progreso General</h2>
              <span className="progress-percentage">
                {progreso.porcentaje_completado}%
              </span>
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${progreso.porcentaje_completado}%` }}
              ></div>
            </div>
            <p className="progress-info">
              {progreso.retos_completados} de {progreso.total_retos} retos completados
            </p>
          </div>
        )}

        {/* Grid de temas */}
        <div className="temas-section">
          <h2 className="section-title">Temas Disponibles</h2>
          <div className="temas-grid">
            {temas.map((tema, indice) => {
              const estado = obtenerEstadoTema(tema, indice);

              return (
                <div
                  key={tema.id_tema}
                  className={`tema-card tema-${estado}`}
                  onClick={() => estado === 'disponible' && handleVerTema(tema.id_tema)}
                >
                  {/* Imagen del tema */}
                  <div className="tema-image-container">
                    {tema.img_tema && tema.img_tema !== 'default_tema.png' ? (
                      <img
                        src={`http://localhost:8000${tema.img_tema}`}
                        alt={tema.nombre}
                        className="tema-image"
                      />
                    ) : (
                      <div className="tema-image-placeholder">
                        <span className="placeholder-icon">📚</span>
                      </div>
                    )}

                    {/* Badge de estado */}
                    <div className={`tema-badge tema-badge-${estado}`}>
                      {estado === 'bloqueado' && '🔒 Bloqueado'}
                      {estado === 'disponible' && '✅ Disponible'}
                      {estado === 'completado' && '🎉 Completado'}
                    </div>
                  </div>

                  {/* Información del tema */}
                  <div className="tema-content">
                    <h3 className="tema-name">{tema.nombre}</h3>
                    <p className="tema-description">
                      {tema.descripcion || 'Sin descripción'}
                    </p>
                    {estado === 'disponible' && (
                      <button className="tema-btn">
                        Iniciar Tema →
                      </button>
                    )}
                    {estado === 'bloqueado' && (
                      <p className="tema-locked-msg">
                        Completa el tema anterior para desbloquear
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {temas.length === 0 && !cargando && (
            <div className="empty-state">
              <p>No hay temas disponibles en este momento</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
