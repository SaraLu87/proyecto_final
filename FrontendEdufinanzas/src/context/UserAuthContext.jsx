/**
 * CONTEXT: AUTENTICACIÓN DE USUARIOS (NO ADMINISTRADORES)
 *
 * Este contexto maneja toda la lógica de autenticación de usuarios regulares:
 * - Login y logout
 * - Persistencia de sesión con localStorage (separada de la sesión admin)
 * - Validación de rol de Usuario
 * - Estado global del usuario autenticado
 * - Gestión del perfil del usuario
 */

import { createContext, useContext, useState, useEffect } from 'react';
import {
  login as loginAPI,
  registro as registroAPI,
  obtenerMiPerfil
} from '../services/api';

// Crear contexto de autenticación de usuarios
const UserAuthContext = createContext();

/**
 * Hook personalizado para usar el contexto de autenticación de usuarios
 * @returns {Object} - Objeto con estado y funciones de autenticación
 */
export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth debe usarse dentro de UserAuthProvider');
  }
  return context;
};

/**
 * Provider de autenticación para usuarios
 * Envuelve la aplicación y provee el contexto de autenticación
 */
export const UserAuthProvider = ({ children }) => {
  // Estado del usuario autenticado
  const [usuario, setUsuario] = useState(null);

  // Estado del perfil del usuario
  const [perfil, setPerfil] = useState(null);

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
      const userToken = localStorage.getItem('userToken');
      const usuarioGuardado = localStorage.getItem('userUsuario');
      const perfilGuardado = localStorage.getItem('userPerfil');

      if (userToken && usuarioGuardado) {
        const usuarioData = JSON.parse(usuarioGuardado);

        // Validar que sea usuario regular (no administrador)
        if (usuarioData.rol === 'Usuario') {
          setUsuario(usuarioData);

          // Cargar perfil si existe
          if (perfilGuardado) {
            setPerfil(JSON.parse(perfilGuardado));
          }
        } else {
          // Si no es usuario regular, limpiar sesión
          limpiarSesion();
        }
      }
    } catch (error) {
      console.error('Error al verificar sesión de usuario:', error);
      limpiarSesion();
    } finally {
      setCargando(false);
    }
  };

  /**
   * Función para iniciar sesión
   * @param {string} correo - Email del usuario
   * @param {string} contrasena - Contraseña
   * @returns {Promise} - Retorna objeto con success y message
   */
  const login = async (correo, contrasena) => {
    try {
      // Llamar a la API de login
      const response = await loginAPI(correo, contrasena);

      // Verificar que la respuesta contenga token y usuario
      if (response && response.token && response.usuario) {
        const { token, usuario: usuarioData } = response;

        // Validar que el usuario sea de rol 'Usuario' (no administrador)
        if (usuarioData.rol !== 'Usuario') {
          throw new Error('Acceso denegado. Esta área es solo para usuarios registrados.');
        }

        // Guardar token en localStorage (con prefijo 'user' para diferenciar)
        localStorage.setItem('userToken', token);

        // Guardar datos del usuario en localStorage
        localStorage.setItem('userUsuario', JSON.stringify(usuarioData));

        // Actualizar estado
        setUsuario(usuarioData);

        // Cargar perfil del usuario desde el endpoint /api/perfil/me/
        try {
          // Temporalmente guardar el token para que el interceptor lo use
          localStorage.setItem('userToken', token);

          const perfilData = await obtenerMiPerfil();

          if (perfilData) {
            localStorage.setItem('userPerfil', JSON.stringify(perfilData));
            setPerfil(perfilData);
          }
        } catch (perfilError) {
          console.error('Error al cargar perfil:', perfilError);
          // Continuar aunque falle la carga del perfil
        }

        return { success: true, message: 'Login exitoso' };
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
    } catch (error) {
      console.error('Error en login de usuario:', error);

      // Determinar mensaje de error
      let mensaje = 'Error al iniciar sesión';

      if (error.response) {
        // Error de la API
        if (error.response.status === 401) {
          mensaje = 'Credenciales incorrectas';
        } else if (error.response.status === 404) {
          mensaje = 'Usuario no encontrado';
        } else if (error.response.data && error.response.data.detail) {
          mensaje = error.response.data.detail;
        }
      } else if (error.message) {
        mensaje = error.message;
      }

      return { success: false, message: mensaje };
    }
  };

  /**
   * Función para registrar un nuevo usuario
   * @param {object} datos - Datos del registro (correo, contrasena, nombre_perfil, edad)
   * @returns {Promise} - Retorna objeto con success y message
   */
  const registro = async (datos) => {
    try {
      // Llamar a la API de registro
      const response = await registroAPI(datos);

      // Verificar respuesta exitosa
      if (response && response.usuario && response.perfil) {
        return {
          success: true,
          message: response.message || 'Registro exitoso',
          data: response
        };
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
    } catch (error) {
      console.error('Error en registro:', error);

      // Determinar mensaje de error
      let mensaje = 'Error al registrar usuario';

      if (error.response) {
        if (error.response.data && error.response.data.detail) {
          mensaje = error.response.data.detail;
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
   * Limpia todos los datos de sesión del usuario
   */
  const limpiarSesion = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userUsuario');
    localStorage.removeItem('userPerfil');
    setUsuario(null);
    setPerfil(null);
  };

  /**
   * Verifica si el usuario está autenticado
   * @returns {boolean}
   */
  const estaAutenticado = () => {
    return usuario !== null && usuario.rol === 'Usuario';
  };

  /**
   * Recarga el perfil del usuario desde el backend
   * Útil después de completar retos o actualizar perfil
   */
  const recargarPerfil = async () => {
    try {
      const perfilData = await obtenerMiPerfil();

      if (perfilData) {
        localStorage.setItem('userPerfil', JSON.stringify(perfilData));
        setPerfil(perfilData);
      }

      return { success: true, perfil: perfilData };
    } catch (error) {
      console.error('Error al recargar perfil:', error);
      return { success: false, message: 'Error al recargar perfil' };
    }
  };

  // Valor del contexto que se provee a los componentes hijos
  const value = {
    usuario,
    perfil,
    cargando,
    login,
    registro,
    logout,
    estaAutenticado,
    recargarPerfil,
  };

  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  );
};

export default UserAuthContext;
