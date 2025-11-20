/**
 * PÁGINA: JUEGO DE RETO
 *
 * Página donde el usuario resuelve un reto:
 * - Muestra la pregunta del reto
 * - Muestra 4 opciones de respuesta
 * - Valida la respuesta seleccionada
 * - Otorga recompensa si es correcta
 * - Actualiza progreso y monedas
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';
import { obtenerReto, solucionarReto } from '../../services/api';
import './RetoJuego.css';

const RetoJuego = () => {
  const { idReto } = useParams();
  const navigate = useNavigate();
  const { perfil, recargarPerfil } = useUserAuth();

  // Estados
  const [reto, setReto] = useState(null);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState('');
  const [respondido, setRespondido] = useState(false);
  const [resultado, setResultado] = useState(null); // {correcto: boolean, mensaje: string}
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  /**
   * Cargar datos del reto al montar
   */
  useEffect(() => {
    cargarReto();
  }, [idReto]);

  /**
   * Cargar información del reto
   */
  const cargarReto = async () => {
    try {
      setCargando(true);
      setError('');

      const retoData = await obtenerReto(idReto);
      setReto(retoData);
    } catch (err) {
      console.error('Error al cargar reto:', err);
      setError('Error al cargar el reto');
    } finally {
      setCargando(false);
    }
  };

  /**
   * Manejar selección de respuesta
   */
  const handleSeleccionarRespuesta = (respuesta) => {
    if (!respondido) {
      setRespuestaSeleccionada(respuesta);
    }
  };

  /**
   * Enviar respuesta
   */
  const handleEnviarRespuesta = async () => {
    if (!respuestaSeleccionada) {
      setError('Por favor selecciona una respuesta');
      return;
    }

    if (respondido) {
      return; // Ya respondió
    }

    try {
      setEnviando(true);
      setError('');

      // Enviar respuesta al backend
      const respuesta = await solucionarReto(
        perfil.id_perfil,
        parseInt(idReto),
        respuestaSeleccionada
      );

      // La respuesta del backend es un array
      const data = Array.isArray(respuesta) ? respuesta[0] : respuesta;

      // Marcar como respondido
      setRespondido(true);

      // Determinar si fue correcta
      const esCorrecto = data.completado === true || data.completado === 1;

      setResultado({
        correcto: esCorrecto,
        mensaje: esCorrecto
          ? `¡Correcto! Ganaste ${reto.recompensa_monedas} monedas 🎉`
          : 'Respuesta incorrecta. Intenta de nuevo'
      });

      // Recargar perfil para actualizar monedas
      if (esCorrecto) {
        await recargarPerfil();
      }

    } catch (err) {
      console.error('Error al enviar respuesta:', err);
      setError(err.response?.data?.detail || 'Error al enviar la respuesta');
    } finally {
      setEnviando(false);
    }
  };

  /**
   * Volver al tema
   */
  const handleVolver = () => {
    if (reto) {
      navigate(`/usuario/tema/${reto.id_tema}`);
    } else {
      navigate('/usuario/dashboard');
    }
  };

  /**
   * Continuar al siguiente reto o volver
   */
  const handleContinuar = () => {
    handleVolver();
  };

  // Mostrar loader
  if (cargando) {
    return (
      <div className="reto-juego-loading">
        <div className="spinner"></div>
        <p>Cargando reto...</p>
      </div>
    );
  }

  // Mostrar error si no hay reto
  if (!reto) {
    return (
      <div className="reto-juego-error">
        <p>No se encontró el reto</p>
        <button onClick={handleVolver}>Volver</button>
      </div>
    );
  }

  // Preparar las opciones de respuesta
  const opciones = [
    reto.respuesta_uno,
    reto.respuesta_dos,
    reto.respuesta_tres,
    reto.respuesta_cuatro
  ].filter(Boolean); // Filtrar opciones vacías

  return (
    <div className="reto-juego-page">
      <div className="reto-juego-container">
        {/* Header del reto */}
        <div className="reto-header">
          <button className="btn-back-small" onClick={handleVolver}>
            ← Volver
          </button>
          <div className="reto-header-info">
            <h1 className="reto-title">{reto.nombre_reto}</h1>
            <div className="reto-rewards">
              <span className="reward-item">
                💰 Costo: {reto.costo_monedas} monedas
              </span>
              <span className="reward-item">
                🏆 Recompensa: {reto.recompensa_monedas} monedas
              </span>
            </div>
          </div>
        </div>

        {/* Card del juego */}
        <div className="juego-card">
          {/* Descripción del reto - SIEMPRE VISIBLE */}
          {reto.descripcion && (
            <div className="juego-description-destacada">
              <div className="description-icon">📝</div>
              <div className="description-content">
                <h3 className="description-title">Descripción del Reto</h3>
                <p className="description-text">{reto.descripcion}</p>
              </div>
            </div>
          )}

          {/* Imagen del reto */}
          {reto.img_reto && reto.img_reto !== 'default_reto.png' && (
            <div className="juego-image-container">
              <img
                src={`http://localhost:8000${reto.img_reto}`}
                alt={reto.nombre_reto}
                className="juego-image"
              />
            </div>
          )}

          {/* Pregunta */}
          <div className="juego-pregunta">
            <h2 className="pregunta-titulo">Pregunta:</h2>
            <p className="pregunta-texto">{reto.pregunta}</p>
          </div>

          {/* Opciones de respuesta */}
          <div className="juego-opciones">
            {opciones.map((opcion, index) => {
              const letra = String.fromCharCode(65 + index); // A, B, C, D
              const isSelected = respuestaSeleccionada === opcion;
              const isCorrect = respondido && resultado?.correcto && isSelected;
              const isIncorrect = respondido && !resultado?.correcto && isSelected;

              return (
                <button
                  key={index}
                  className={`opcion-btn ${isSelected ? 'selected' : ''} ${
                    isCorrect ? 'correct' : ''
                  } ${isIncorrect ? 'incorrect' : ''}`}
                  onClick={() => handleSeleccionarRespuesta(opcion)}
                  disabled={respondido}
                >
                  <span className="opcion-letra">{letra}</span>
                  <span className="opcion-texto">{opcion}</span>
                  {isCorrect && <span className="opcion-icon">✓</span>}
                  {isIncorrect && <span className="opcion-icon">✗</span>}
                </button>
              );
            })}
          </div>

          {/* Mensajes */}
          {error && (
            <div className="alert alert-error">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {resultado && (
            <div className={`alert ${resultado.correcto ? 'alert-success' : 'alert-error'}`}>
              <span>{resultado.correcto ? '🎉' : '😔'}</span>
              <span>{resultado.mensaje}</span>
            </div>
          )}

          {/* Botones de acción */}
          <div className="juego-actions">
            {!respondido ? (
              <button
                className="btn-enviar"
                onClick={handleEnviarRespuesta}
                disabled={!respuestaSeleccionada || enviando}
              >
                {enviando ? (
                  <>
                    <span className="spinner-small"></span>
                    Enviando...
                  </>
                ) : (
                  '✓ Enviar Respuesta'
                )}
              </button>
            ) : (
              <button className="btn-continuar" onClick={handleContinuar}>
                {resultado?.correcto ? '→ Continuar' : '← Volver al Tema'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetoJuego;
