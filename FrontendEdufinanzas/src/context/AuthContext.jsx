/**
 * CONTEXT: AUTENTICACIÓN
 *
 * Este contexto maneja toda la lógica de autenticación del administrador:
 * - Login y logout
 * - Persistencia de sesión con localStorage
 * - Validación de rol de administrador
 * - Estado global del usuario autenticado
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginAPI } from '../services/api';

// Crear contexto de autenticación
const AuthContext = createContext();

/**
 * Hook personalizado para usar el contexto de autenticación
 * @returns {Object} - Objeto con estado y funciones de autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

/**
 * Provider de autenticación
 * Envuelve la aplicación y provee el contexto de autenticación
 */
export const AuthProvider = ({ children }) => {
  // Estado del usuario autenticado
  const [usuario, setUsuario] = useState(null);

  // Estado de carga mientras se verifica la sesión
  const [cargando, setCargando] = useState(true);

  /**
   * Verificar si hay una sesión guardada en localStorage
   * Se ejecuta al montar el componente
   */
  useEffect(() => {
    verificarSesion();
  }, []);

  /**
   * Verifica si existe un usuario guardado en localStorage
   * y lo carga en el estado
   */
  const verificarSesion = () => {
    try {
      const token = localStorage.getItem('token');
      const usuarioGuardado = localStorage.getItem('usuario');

      if (token && usuarioGuardado) {
        const usuarioData = JSON.parse(usuarioGuardado);

        // Validar que sea administrador
        if (usuarioData.rol === 'Administrador') {
          setUsuario(usuarioData);
        } else {
          // Si no es administrador, limpiar sesión
          limpiarSesion();
        }
      }
    } catch (error) {
      console.error('Error al verificar sesión:', error);
      limpiarSesion();
    } finally {
      setCargando(false);
    }
  };

  /**
   * Función para iniciar sesión
   * @param {string} correo - Email del usuario
   * @param {string} contrasena - Contraseña
   * @returns {Promise} - Retorna true si login exitoso, false si falla
   */
  const login = async (correo, contrasena) => {
    try {
      // Llamar a la API de login
      const response = await loginAPI(correo, contrasena);

      // Verificar que la respuesta contenga token y usuario
      if (response && response.token && response.usuario) {
        const { token, usuario: usuarioData } = response;

        // Validar que el usuario sea administrador
        if (usuarioData.rol !== 'Administrador') {
          throw new Error('Acceso denegado. Solo administradores pueden acceder.');
        }

        // Guardar token en localStorage
        localStorage.setItem('token', token);

        // Guardar datos del usuario en localStorage
        localStorage.setItem('usuario', JSON.stringify(usuarioData));

        // Actualizar estado
        setUsuario(usuarioData);

        return { success: true, message: 'Login exitoso' };
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
    } catch (error) {
      console.error('Error en login:', error);

      // Determinar mensaje de error
      let mensaje = 'Error al iniciar sesión';

      if (error.response) {
        // Error de la API
        if (error.response.status === 401) {
          mensaje = 'Credenciales incorrectas';
        } else if (error.response.data && error.response.data.message) {
          mensaje = error.response.data.message;
        }
      } else if (error.message) {
        mensaje = error.message;
      }

      return { success: false, message: mensaje };
    }
  };

  /**
   * Función para cerrar sesión
   */
  const logout = () => {
    limpiarSesion();
  };

  /**
   * Limpia todos los datos de sesión
   */
  const limpiarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  /**
   * Verifica si el usuario está autenticado
   * @returns {boolean}
   */
  const estaAutenticado = () => {
    return usuario !== null && usuario.rol === 'Administrador';
  };

  // Valor del contexto que se provee a los componentes hijos
  const value = {
    usuario,
    cargando,
    login,
    logout,
    estaAutenticado,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
