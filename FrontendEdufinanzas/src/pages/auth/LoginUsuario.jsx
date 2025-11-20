/**
 * PÁGINA: LOGIN DE USUARIOS
 *
 * Página de inicio de sesión para usuarios regulares (rol='Usuario')
 * Incluye:
 * - Formulario de login (correo y contraseña)
 * - Mensaje de éxito al iniciar sesión
 * - Link al login de administradores
 * - Link a la página de registro
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';
import './LoginUsuario.css';

const LoginUsuario = () => {
  const navigate = useNavigate();
  const { login, estaAutenticado } = useUserAuth();

  // Estado del formulario
  const [formData, setFormData] = useState({
    correo: '',
    contrasena: '',
  });

  // Estados de carga y mensajes
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  /**
   * Redirigir si ya está autenticado
   */
  // useEffect(() => {
  //   if (estaAutenticado()) {
  //     navigate('/');
  //   }
  // }, [estaAutenticado, navigate]);

  /**
   * Manejar cambios en los campos del formulario
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError(''); // Limpiar error al escribir
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
   * Manejar el envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formulario
    if (!validarFormulario()) {
      return;
    }

    setCargando(true);
    setError('');
    setExito('');

    try {
      // Llamar a la función de login del contexto
      const resultado = await login(formData.correo, formData.contrasena);

      if (resultado.success) {
        // Mostrar mensaje de éxito
        setExito('¡Inicio de sesión exitoso! Bienvenido de vuelta 🎉');

        // Esperar 1 segundo y redirigir al dashboard de usuario
        setTimeout(() => {
          navigate('/usuario/dashboard');
        }, 1000);
      } else {
        // Mostrar error del backend
        setError(resultado.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      console.error('Error en login:', err);
      setError('Error inesperado. Por favor intenta nuevamente.');
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
            <h2 className="login-subtitle">Iniciar Sesión</h2>
            <p className="login-description">
              Aprende sobre finanzas de forma divertida
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

            {/* Mensaje de éxito */}
            {exito && (
              <div className="login-success">
                <span className="success-icon">✅</span>
                <span>{exito}</span>
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
                placeholder="tu@correo.com"
                className="form-control"
                disabled={cargando}
                autoComplete="email"
                autoFocus
              />
            </div>

            {/* Campo de contraseña */}
            <div className="form-group">
              <label htmlFor="contrasena" className="form-label">
                Contraseña
              </label>
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
            <p className="register-link">
              ¿No tienes cuenta?{' '}
              <Link to="/registro" className="link-primary">
                Regístrate aquí
              </Link>
            </p>

            <div className="divider"></div>

            <p className="admin-link">
              <Link to="/login" className="link-secondary">
                Login para administradores
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginUsuario;
