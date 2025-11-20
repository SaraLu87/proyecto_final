/**
 * PÁGINA: PERFIL DE USUARIO
 *
 * Muestra y permite editar la información del usuario:
 * - Ver información personal (nombre, correo, edad, monedas)
 * - Editar nombre de perfil
 * - Cambiar contraseña
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';
import { actualizarMiPerfil } from '../../services/api';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { usuario, perfil, recargarPerfil } = useUserAuth();

  // Estados para edición
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    nombre_perfil: '',
    contrasena: '',
    confirmarContrasena: '',
  });

  // Estados de UI
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  /**
   * Cargar datos del perfil al montar
   */
  useEffect(() => {
    if (perfil) {
      setFormData({
        nombre_perfil: perfil.nombre_perfil || '',
        contrasena: '',
        confirmarContrasena: '',
      });
    }
  }, [perfil]);

  /**
   * Manejar cambios en los inputs
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
    setExito('');
  };

  /**
   * Validar formulario
   */
  const validar = () => {
    if (!formData.nombre_perfil.trim()) {
      setError('El nombre de perfil es obligatorio');
      return false;
    }

    // Si está cambiando la contraseña, validarla
    if (formData.contrasena) {
      if (formData.contrasena.length < 4) {
        setError('La contraseña debe tener al menos 4 caracteres');
        return false;
      }

      if (formData.contrasena !== formData.confirmarContrasena) {
        setError('Las contraseñas no coinciden');
        return false;
      }
    }

    return true;
  };

  /**
   * Guardar cambios
   */
  const handleGuardar = async () => {
    if (!validar()) return;

    setCargando(true);
    setError('');
    setExito('');

    try {
      // Preparar datos para enviar (solo enviar contraseña si fue ingresada)
      const datosActualizar = {
        nombre_perfil: formData.nombre_perfil,
      };

      if (formData.contrasena) {
        datosActualizar.contrasena = formData.contrasena;
      }

      await actualizarMiPerfil(datosActualizar);

      // Recargar perfil para reflejar cambios
      await recargarPerfil();

      setExito('Perfil actualizado correctamente');
      setEditando(false);

      // Limpiar contraseñas
      setFormData({
        ...formData,
        contrasena: '',
        confirmarContrasena: '',
      });
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      setError(err.response?.data?.detail || 'Error al actualizar el perfil');
    } finally {
      setCargando(false);
    }
  };

  /**
   * Cancelar edición
   */
  const handleCancelar = () => {
    setEditando(false);
    setFormData({
      nombre_perfil: perfil?.nombre_perfil || '',
      contrasena: '',
      confirmarContrasena: '',
    });
    setError('');
    setExito('');
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Encabezado */}
        <div className="profile-header">
          <button className="btn-back" onClick={() => navigate('/usuario/dashboard')}>
            ← Volver al Dashboard
          </button>
          <h1 className="profile-title">Mi Perfil</h1>
        </div>

        {/* Card de información */}
        <div className="profile-card">
          {/* Mensajes */}
          {error && (
            <div className="alert alert-error">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {exito && (
            <div className="alert alert-success">
              <span>✅</span>
              <span>{exito}</span>
            </div>
          )}

          {/* Avatar y monedas */}
          <div className="profile-avatar-section">
            <div className="avatar-circle">
              <span className="avatar-icon">👤</span>
            </div>
            <div className="coins-display">
              <span className="coin-icon">🪙</span>
              <span className="coin-amount">{perfil?.monedas || 0}</span>
              <span className="coin-label">monedas</span>
            </div>
          </div>

          {/* Información del perfil */}
          <div className="profile-info">
            {/* Correo (no editable) */}
            <div className="info-group">
              <label className="info-label">Correo Electrónico</label>
              <input
                type="email"
                value={usuario?.correo || ''}
                disabled
                className="info-input"
              />
            </div>

            {/* Nombre de perfil */}
            <div className="info-group">
              <label className="info-label">Nombre de Perfil</label>
              <input
                type="text"
                name="nombre_perfil"
                value={formData.nombre_perfil}
                onChange={handleChange}
                disabled={!editando}
                className="info-input"
              />
            </div>

            {/* Edad (no editable por ahora) */}
            <div className="info-group">
              <label className="info-label">Edad</label>
              <input
                type="number"
                value={perfil?.edad || ''}
                disabled
                className="info-input"
              />
            </div>

            {/* Cambiar contraseña (solo si está editando) */}
            {editando && (
              <>
                <div className="info-group">
                  <label className="info-label">Nueva Contraseña (opcional)</label>
                  <input
                    type="password"
                    name="contrasena"
                    value={formData.contrasena}
                    onChange={handleChange}
                    placeholder="Dejar en blanco para no cambiar"
                    className="info-input"
                  />
                </div>

                <div className="info-group">
                  <label className="info-label">Confirmar Contraseña</label>
                  <input
                    type="password"
                    name="confirmarContrasena"
                    value={formData.confirmarContrasena}
                    onChange={handleChange}
                    placeholder="Confirmar nueva contraseña"
                    className="info-input"
                  />
                </div>
              </>
            )}
          </div>

          {/* Botones de acción */}
          <div className="profile-actions">
            {!editando ? (
              <button className="btn-primary" onClick={() => setEditando(true)}>
                ✏️ Editar Perfil
              </button>
            ) : (
              <>
                <button
                  className="btn-success"
                  onClick={handleGuardar}
                  disabled={cargando}
                >
                  {cargando ? 'Guardando...' : '✓ Guardar Cambios'}
                </button>
                <button
                  className="btn-secondary"
                  onClick={handleCancelar}
                  disabled={cargando}
                >
                  ✕ Cancelar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
