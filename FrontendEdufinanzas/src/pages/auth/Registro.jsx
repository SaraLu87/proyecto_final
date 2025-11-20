/**
 * PÁGINA: REGISTRO DE USUARIOS
 *
 * Formulario de registro en dos pasos:
 * - Paso 1: Datos del usuario (correo, contraseña)
 * - Paso 2: Datos del perfil (nombre_perfil, edad)
 *
 * Una vez completado el registro, redirige a la página de login
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';
import './Registro.css';

const Registro = () => {
  const navigate = useNavigate();
  const { registro } = useUserAuth();

  // Control del paso actual del formulario (1 o 2)
  const [pasoActual, setPasoActual] = useState(1);

  // Estado de carga
  const [cargando, setCargando] = useState(false);

  // Mensajes de error y éxito
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  // Datos del formulario - Paso 1: Usuario
  const [datosUsuario, setDatosUsuario] = useState({
    correo: '',
    contrasena: '',
    confirmarContrasena: '',
  });

  // Datos del formulario - Paso 2: Perfil
  const [datosPerfil, setDatosPerfil] = useState({
    nombre_perfil: '',
    edad: '',
  });

  /**
   * Manejar cambios en los campos del Paso 1 (Usuario)
   */
  const handleChangeUsuario = (e) => {
    const { name, value } = e.target;
    setDatosUsuario({
      ...datosUsuario,
      [name]: value,
    });
    setError(''); // Limpiar error al escribir
  };

  /**
   * Manejar cambios en los campos del Paso 2 (Perfil)
   */
  const handleChangePerfil = (e) => {
    const { name, value } = e.target;
    setDatosPerfil({
      ...datosPerfil,
      [name]: value,
    });
    setError(''); // Limpiar error al escribir
  };

  /**
   * Validar y avanzar del Paso 1 al Paso 2
   */
  const avanzarPaso = (e) => {
    e.preventDefault();
    setError('');

    // Validar que todos los campos estén completos
    if (!datosUsuario.correo.trim() || !datosUsuario.contrasena.trim() || !datosUsuario.confirmarContrasena.trim()) {
      setError('Todos los campos son obligatorios');
      return;
    }

    // Validar formato de correo
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(datosUsuario.correo)) {
      setError('Por favor ingresa un correo válido');
      return;
    }

    // Validar longitud de contraseña
    if (datosUsuario.contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Validar que las contraseñas coincidan
    if (datosUsuario.contrasena !== datosUsuario.confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Avanzar al paso 2
    setPasoActual(2);
  };

  /**
   * Retroceder del Paso 2 al Paso 1
   */
  const retrocederPaso = () => {
    setPasoActual(1);
    setError('');
  };

  /**
   * Manejar el envío final del formulario (Paso 2)
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');

    // Validar campos del perfil
    if (!datosPerfil.nombre_perfil.trim() || !datosPerfil.edad) {
      setError('Todos los campos son obligatorios');
      return;
    }

    // Validar edad
    const edad = parseInt(datosPerfil.edad);
    if (isNaN(edad) || edad < 1 || edad > 120) {
      setError('Por favor ingresa una edad válida (entre 1 y 120 años)');
      return;
    }

    // Validar longitud del nombre de perfil
    if (datosPerfil.nombre_perfil.length < 3) {
      setError('El nombre del perfil debe tener al menos 3 caracteres');
      return;
    }

    try {
      setCargando(true);

      // Preparar datos completos para enviar al backend
      const datosCompletos = {
        correo: datosUsuario.correo,
        contrasena: datosUsuario.contrasena,
        nombre_perfil: datosPerfil.nombre_perfil,
        edad: parseInt(datosPerfil.edad),
      };

      // Llamar a la función de registro del contexto
      const resultado = await registro(datosCompletos);

      if (resultado.success) {
        // Mostrar mensaje de éxito
        setExito(resultado.message || 'Registro completado exitosamente');

        // Esperar 2 segundos y redirigir al login
        setTimeout(() => {
          navigate('/login-usuario');
        }, 2000);
      } else {
        // Mostrar error del backend
        setError(resultado.message || 'Error al registrar usuario');
      }
    } catch (err) {
      console.error('Error en registro:', err);
      setError('Error inesperado. Por favor intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-card">
        {/* Header con logo o título */}
        <div className="registro-header">
          <h1 className="registro-title">Crear Cuenta</h1>
          <p className="registro-subtitle">
            {pasoActual === 1
              ? 'Paso 1 de 2: Información de la cuenta'
              : 'Paso 2 de 2: Información del perfil'}
          </p>
        </div>

        {/* Indicador de progreso */}
        <div className="progreso-wrapper">
          <div className="progreso-barra">
            <div
              className="progreso-relleno"
              style={{ width: pasoActual === 1 ? '50%' : '100%' }}
            ></div>
          </div>
          <div className="progreso-pasos">
            <div className={`paso ${pasoActual === 1 ? 'activo' : 'completado'}`}>
              <span className="paso-numero">1</span>
              <span className="paso-texto">Usuario</span>
            </div>
            <div className={`paso ${pasoActual === 2 ? 'activo' : ''}`}>
              <span className="paso-numero">2</span>
              <span className="paso-texto">Perfil</span>
            </div>
          </div>
        </div>

        {/* Mensajes de error y éxito */}
        {error && (
          <div className="mensaje mensaje-error">
            <span className="icono">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {exito && (
          <div className="mensaje mensaje-exito">
            <span className="icono">✅</span>
            <span>{exito}</span>
          </div>
        )}

        {/* Formulario Paso 1: Datos del Usuario */}
        {pasoActual === 1 && (
          <form onSubmit={avanzarPaso} className="registro-form">
            <div className="form-group">
              <label htmlFor="correo" className="form-label">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="correo"
                name="correo"
                value={datosUsuario.correo}
                onChange={handleChangeUsuario}
                placeholder="tu@correo.com"
                className="form-input"
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="contrasena" className="form-label">
                Contraseña
              </label>
              <input
                type="password"
                id="contrasena"
                name="contrasena"
                value={datosUsuario.contrasena}
                onChange={handleChangeUsuario}
                placeholder="Mínimo 6 caracteres"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmarContrasena" className="form-label">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                id="confirmarContrasena"
                name="confirmarContrasena"
                value={datosUsuario.confirmarContrasena}
                onChange={handleChangeUsuario}
                placeholder="Repite tu contraseña"
                className="form-input"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full">
              Continuar al Paso 2
            </button>

            <div className="registro-footer">
              <p>
                ¿Ya tienes cuenta?{' '}
                <Link to="/login-usuario" className="link">
                  Inicia sesión
                </Link>
              </p>
            </div>
          </form>
        )}

        {/* Formulario Paso 2: Datos del Perfil */}
        {pasoActual === 2 && (
          <form onSubmit={handleSubmit} className="registro-form">
            <div className="form-group">
              <label htmlFor="nombre_perfil" className="form-label">
                Nombre de Usuario
              </label>
              <input
                type="text"
                id="nombre_perfil"
                name="nombre_perfil"
                value={datosPerfil.nombre_perfil}
                onChange={handleChangePerfil}
                placeholder="Ej: Juan123"
                className="form-input"
                required
                autoFocus
              />
              <small className="form-help">
                Este será tu nombre visible en la plataforma
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="edad" className="form-label">
                Edad
              </label>
              <input
                type="number"
                id="edad"
                name="edad"
                value={datosPerfil.edad}
                onChange={handleChangePerfil}
                placeholder="Ej: 25"
                className="form-input"
                min="1"
                max="120"
                required
              />
            </div>

            <div className="btn-group">
              <button
                type="button"
                onClick={retrocederPaso}
                className="btn btn-secondary"
                disabled={cargando}
              >
                ← Atrás
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={cargando}
              >
                {cargando ? 'Registrando...' : 'Completar Registro'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Registro;
