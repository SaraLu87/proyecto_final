/**
 * PÁGINA: DETALLE DE TEMA
 *
 * Muestra información del tema y lista de retos con:
 * - Información del tema seleccionado
 * - Lista de retos con estado (bloqueado/disponible/completado)
 * - Botón para iniciar reto (descuenta monedas)
 * - Navegar al reto para jugarlo
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';
import { obtenerTema, obtenerRetosDelTema, iniciarReto } from '../../services/api';
import './TemaDetalle.css';

const TemaDetalle = () => {
  const { idTema } = useParams();
  const navigate = useNavigate();
  const { perfil, recargarPerfil } = useUserAuth();

  // Estados
  const [tema, setTema] = useState(null);
  const [retos, setRetos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(null); // ID del reto que se está procesando
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  /**
   * Cargar datos del tema y retos al montar
   */
  useEffect(() => {
    cargarDatos();
  }, [idTema]);

  /**
   * Cargar tema y retos
   */
  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError('');

      // Cargar tema y retos en paralelo
      const [temaData, retosData] = await Promise.all([
        obtenerTema(idTema),
        obtenerRetosDelTema(idTema)
      ]);

      setTema(temaData);
      setRetos(retosData);
    } catch (err) {
      console.error('Error al cargar datos del tema:', err);
      setError('Error al cargar el tema. Por favor, intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  /**
   * Iniciar un reto (comprar con monedas)
   */
  const handleIniciarReto = async (reto) => {
    // Verificar si ya está completado
    if (reto.completado) {
      setError('Este reto ya fue completado');
      return;
    }

    // Verificar si ya fue iniciado
    if (reto.id_progreso) {
      // Ya está iniciado, ir directo al juego
      navigate(`/usuario/reto/${reto.id_reto}`);
      return;
    }

    // Verificar monedas suficientes
    if (perfil.monedas < reto.costo_monedas) {
      setError(`Necesitas ${reto.costo_monedas} monedas. Te faltan ${reto.costo_monedas - perfil.monedas} monedas.`);
      return;
    }

    try {
      setProcesando(reto.id_reto);
      setError('');
      setExito('');

      // Iniciar reto (descuenta monedas y crea progreso)
      await iniciarReto(reto.id_reto);

      // Recargar perfil para actualizar monedas
      await recargarPerfil();

      // Recargar retos para actualizar estados
      const retosData = await obtenerRetosDelTema(idTema);
      setRetos(retosData);

      setExito(`¡Reto iniciado! Se descontaron ${reto.costo_monedas} monedas.`);

      // Navegar al reto después de 1 segundo
      setTimeout(() => {
        navigate(`/usuario/reto/${reto.id_reto}`);
      }, 1000);

    } catch (err) {
      console.error('Error al iniciar reto:', err);
      setError(err.response?.data?.detail || 'Error al iniciar el reto');
    } finally {
      setProcesando(null);
    }
  };

  /**
   * Navegar al reto para jugarlo
   */
  const handleJugarReto = (idReto) => {
    navigate(`/usuario/reto/${idReto}`);
  };

  /**
   * Determinar el estado visual de un reto
   */
  const obtenerEstadoReto = (reto) => {
    if (reto.completado) return 'completado';
    if (reto.id_progreso) return 'iniciado';
    return 'disponible';
  };

  // Mostrar loader
  if (cargando) {
    return (
      <div className="tema-detalle-loading">
        <div className="spinner"></div>
        <p>Cargando tema...</p>
      </div>
    );
  }

  // Mostrar error si no hay tema
  if (!tema) {
    return (
      <div className="tema-detalle-error">
        <p>No se encontró el tema</p>
        <button onClick={() => navigate('/usuario/dashboard')}>
          Volver al Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="tema-detalle-page">
      <div className="tema-detalle-container">
        {/* Botón volver */}
        <button className="btn-back" onClick={() => navigate('/usuario/dashboard')}>
          ← Volver al Dashboard
        </button>

        {/* Header del tema */}
        <div className="tema-header">
          {tema.img_tema && tema.img_tema !== 'default_tema.png' ? (
            <img
              src={`http://localhost:8000${tema.img_tema}`}
              alt={tema.nombre}
              className="tema-header-image"
            />
          ) : (
            <div className="tema-header-placeholder">
              <span className="placeholder-icon">📚</span>
            </div>
          )}
          <div className="tema-header-content">
            <h1 className="tema-title">{tema.nombre}</h1>
            <p className="tema-description">{tema.descripcion}</p>
            {tema.informacion_tema && (
              <p className="tema-info">{tema.informacion_tema}</p>
            )}
          </div>
        </div>

        {/* Mensajes */}
        {error && (
          <div className="alert alert-error">
            <span>⚠️</span>
            <span>{error}</span>
            <button className="alert-close" onClick={() => setError('')}>✕</button>
          </div>
        )}

        {exito && (
          <div className="alert alert-success">
            <span>✅</span>
            <span>{exito}</span>
          </div>
        )}

        {/* Lista de retos */}
        <div className="retos-section">
          <h2 className="section-title">Retos del Tema</h2>

          <div className="retos-list">
            {retos.map((reto) => {
              const estado = obtenerEstadoReto(reto);
              const estaProcesando = procesando === reto.id_reto;

              return (
                <div key={reto.id_reto} className={`reto-card reto-${estado}`}>
                  {/* Imagen del reto */}
                  <div className="reto-image-container">
                    {reto.img_reto && reto.img_reto !== 'default_reto.png' ? (
                      <img
                        src={`http://localhost:8000${reto.img_reto}`}
                        alt={reto.nombre_reto}
                        className="reto-image"
                      />
                    ) : (
                      <div className="reto-image-placeholder">
                        <span className="reto-placeholder-icon">🎯</span>
                      </div>
                    )}

                    {/* Badge de estado */}
                    <div className={`reto-badge reto-badge-${estado}`}>
                      {estado === 'completado' && '✓ Completado'}
                      {estado === 'iniciado' && '⏳ En Progreso'}
                      {estado === 'disponible' && '🎮 Disponible'}
                    </div>
                  </div>

                  {/* Contenido del reto */}
                  <div className="reto-content">
                    <h3 className="reto-name">{reto.nombre_reto}</h3>
                    <p className="reto-description">{reto.descripcion}</p>

                    <div className="reto-details">
                      <div className="reto-detail">
                        <span className="detail-icon">💰</span>
                        <span className="detail-text">
                          Costo: <strong>{reto.costo_monedas}</strong> monedas
                        </span>
                      </div>
                      <div className="reto-detail">
                        <span className="detail-icon">🏆</span>
                        <span className="detail-text">
                          Recompensa: <strong>{reto.recompensa_monedas}</strong> monedas
                        </span>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="reto-actions">
                      {estado === 'completado' && (
                        <button className="btn-completed" disabled>
                          ✓ Completado
                        </button>
                      )}

                      {estado === 'iniciado' && (
                        <button
                          className="btn-play"
                          onClick={() => handleJugarReto(reto.id_reto)}
                        >
                          ▶ Continuar Reto
                        </button>
                      )}

                      {estado === 'disponible' && (
                        <button
                          className="btn-start"
                          onClick={() => handleIniciarReto(reto)}
                          disabled={estaProcesando}
                        >
                          {estaProcesando ? (
                            <>
                              <span className="spinner-small"></span>
                              Iniciando...
                            </>
                          ) : (
                            <>🎯 Iniciar Reto</>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {retos.length === 0 && (
            <div className="empty-state">
              <p>No hay retos disponibles para este tema</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemaDetalle;
