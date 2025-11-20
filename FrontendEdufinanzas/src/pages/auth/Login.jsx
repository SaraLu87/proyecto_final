/**
 * PÁGINA: LOGIN ADMINISTRADOR
 *
 * Página de inicio de sesión para administradores
 * - Formulario de login con email y contraseña
 * - Validación de campos
 * - Manejo de errores
 * - Redirección al dashboard tras login exitoso
 * - Diseño basado en el frontend de usuario con gradiente azul-verde
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, estaAutenticado } = useAuth();

  // Estados del formulario
  const [formData, setFormData] = useState({
    correo: '',
    contrasena: '',
  });

  // Estados de UI
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  /**
   * Redirigir si ya está autenticado
   */
  useEffect(() => {
    if (estaAutenticado()) {
      navigate('/admin');
    }
  }, [estaAutenticado, navigate]);

  /**
   * Manejar cambios en los inputs
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Limpiar error al escribir
    if (error) setError('');
  };

  /**
   * Validar formulario
   */
  const validarFormulario = () => {
    const { correo, contrasena } = formData;

    // Validar que no estén vacíos
    if (!correo.trim() || !contrasena.trim()) {
      setError('Todos los campos son obligatorios');
      return false;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      setError('Ingresa un correo electrónico válido');
      return false;
    }

    // Validar longitud mínima de contraseña
    if (contrasena.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres');
      return false;
    }

    return true;
  };

  /**
   * Manejar envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formulario
    if (!validarFormulario()) {
      return;
    }

    setCargando(true);
    setError('');

    try {
      // Intentar login
      const resultado = await login(formData.correo, formData.contrasena);

      if (resultado.success) {
        // Redirigir al dashboard
        navigate('/admin');
      } else {
        // Mostrar error
        setError(resultado.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      console.error('Error en login:', err);
      setError('Error inesperado. Inténtalo de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  /**
   * Toggle para mostrar/ocultar contraseña
   */
  const toggleMostrarContrasena = () => {
    setMostrarContrasena(!mostrarContrasena);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Card de login */}
        <div className="login-card">
          {/* Header con logo */}
          <div className="login-header">
            <div className="login-logo">
              <div className="logo-circle-login">
                <span className="logo-icon-login">$</span>
              </div>
              <h1 className="login-title">EduFinanzas</h1>
            </div>
            <h2 className="login-subtitle">Panel de Administración</h2>
            <p className="login-description">
              Inicia sesión con tu cuenta de administrador
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* Mensaje de error */}
            {error && (
              <div className="login-error">
                <span className="error-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Campo de email */}
            <div className="form-group">
              <label htmlFor="correo" className="form-label">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="correo"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                placeholder="admin@edufinanzas.com"
                className="form-control"
                disabled={cargando}
                autoComplete="email"
              />
            </div>

            {/* Campo de contraseña */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label htmlFor="contrasena" className="form-label" style={{ margin: 0 }}>
                  Contraseña
                </label>
                <Link
                  to="/recuperar-contrasena"
                  style={{
                    color: '#2F7AD9',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#52E36A'}
                  onMouseLeave={(e) => e.target.style.color = '#2F7AD9'}
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="password-input-wrapper">
                <input
                  type={mostrarContrasena ? 'text' : 'password'}
                  id="contrasena"
                  name="contrasena"
                  value={formData.contrasena}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="form-control"
                  disabled={cargando}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={toggleMostrarContrasena}
                  disabled={cargando}
                >
                  {mostrarContrasena ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Botón de submit */}
            <button
              type="submit"
              className="btn-login"
              disabled={cargando}
            >
              {cargando ? (
                <>
                  <span className="spinner-small"></span>
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <span>Iniciar Sesión</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          {/* Footer del card */}
          <div className="login-footer">
            <p className="login-footer-text">
              Solo administradores pueden acceder a este panel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
