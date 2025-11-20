/**
 * SERVICIO API - CONFIGURACIÓN AXIOS
 *
 * Este archivo configura la instancia base de Axios para realizar
 * peticiones HTTP al backend de Django Rest Framework.
 *
 * BASE URL: http://localhost:8000/api
 *
 * Funcionalidades:
 * - Configuración centralizada de Axios
 * - Interceptor para agregar token JWT automáticamente
 * - Interceptor para manejo de errores globales
 */

import axios from 'axios';

// URL base del backend Django
const API_BASE_URL = 'http://localhost:8000/api';

// Crear instancia de Axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Timeout de 10 segundos
});

/**
 * INTERCEPTOR DE REQUEST
 * Agrega el token JWT a todas las peticiones si existe en localStorage
 * Maneja tanto token de admin como userToken de usuario
 */
api.interceptors.request.use(
  (config) => {
    // Primero intentar con token de admin
    let token = localStorage.getItem('token');

    // Si no hay token de admin, intentar con token de usuario
    if (!token) {
      token = localStorage.getItem('userToken');
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * INTERCEPTOR DE RESPONSE
 * Maneja errores globales como 401 (no autorizado)
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si el token expiró o no es válido, redirigir a login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// ========================================
// SERVICIOS DE AUTENTICACIÓN
// ========================================

/**
 * Login de usuario
 * @param {string} correo - Email del usuario
 * @param {string} contrasena - Contraseña
 * @returns {Promise} - Retorna token y datos del usuario
 */
export const login = async (correo, contrasena) => {
  const response = await api.post('/login_usuario/', {
    correo,
    contrasena,
  });
  return response.data;
};

/**
 * Registro de nuevo usuario
 * @param {object} datos - Datos del usuario y perfil
 * @returns {Promise} - Retorna los datos del usuario y perfil creados
 */
export const registro = async (datos) => {
  const response = await api.post('/registro/', datos);
  return response.data;
};

/**
 * Obtener el perfil del usuario autenticado desde el token
 * @returns {Promise} - Datos del perfil con monedas
 */
export const obtenerMiPerfil = async () => {
  const response = await api.get('/perfil/me/');
  return response.data;
};

// ========================================
// SERVICIOS DE USUARIOS
// ========================================

/**
 * Obtener todos los usuarios
 * @returns {Promise} - Lista de usuarios
 */
export const obtenerUsuarios = async () => {
  const response = await api.get('/usuarios/');
  return response.data;
};

/**
 * Obtener un usuario por ID
 * @param {number} id - ID del usuario
 * @returns {Promise} - Datos del usuario
 */
export const obtenerUsuario = async (id) => {
  const response = await api.get(`/usuarios/${id}/`);
  return response.data;
};

/**
 * Crear nuevo usuario
 * @param {Object} datos - {correo, contrasena, rol}
 * @returns {Promise} - Usuario creado
 */
export const crearUsuario = async (datos) => {
  const response = await api.post('/usuarios/', datos);
  return response.data;
};

/**
 * Actualizar usuario existente
 * @param {number} id - ID del usuario
 * @param {Object} datos - {correo, contrasena, rol}
 * @returns {Promise} - Usuario actualizado
 */
export const actualizarUsuario = async (id, datos) => {
  const response = await api.put(`/usuarios/${id}/`, datos);
  return response.data;
};

/**
 * Eliminar usuario
 * @param {number} id - ID del usuario
 * @returns {Promise}
 */
export const eliminarUsuario = async (id) => {
  const response = await api.delete(`/usuarios/${id}/`);
  return response.data;
};

// ========================================
// SERVICIOS DE TEMAS
// ========================================

/**
 * Obtener todos los temas
 * @returns {Promise} - Lista de temas
 */
export const obtenerTemas = async () => {
  const response = await api.get('/temas/');
  return response.data;
};

/**
 * Obtener un tema por ID
 * @param {number} id - ID del tema
 * @returns {Promise} - Datos del tema
 */
export const obtenerTema = async (id) => {
  const response = await api.get(`/temas/${id}/`);
  return response.data;
};

/**
 * Crear nuevo tema
 * @param {FormData} formData - Datos del tema (incluye imagen)
 * @returns {Promise} - Tema creado
 * @note Axios detecta automáticamente FormData y configura el Content-Type con boundary correcto
 */
export const crearTema = async (formData) => {
  const response = await api.post('/temas/', formData);
  return response.data;
};

/**
 * Actualizar tema existente
 * @param {number} id - ID del tema
 * @param {FormData} formData - Datos del tema (incluye imagen)
 * @returns {Promise} - Tema actualizado
 * @note Axios detecta automáticamente FormData y configura el Content-Type con boundary correcto
 */
export const actualizarTema = async (id, formData) => {
  const response = await api.put(`/temas/${id}/`, formData);
  return response.data;
};

/**
 * Eliminar tema
 * @param {number} id - ID del tema
 * @returns {Promise}
 */
export const eliminarTema = async (id) => {
  const response = await api.delete(`/temas/${id}/`);
  return response.data;
};

// ========================================
// SERVICIOS DE RETOS
// ========================================

/**
 * Obtener todos los retos
 * @returns {Promise} - Lista de retos
 */
export const obtenerRetos = async () => {
  const response = await api.get('/retos/');
  return response.data;
};

/**
 * Obtener un reto por ID
 * @param {number} id - ID del reto
 * @returns {Promise} - Datos del reto
 */
export const obtenerReto = async (id) => {
  const response = await api.get(`/retos/${id}/`);
  return response.data;
};

/**
 * Crear nuevo reto
 * @param {FormData} formData - Datos del reto (incluye imagen y preguntas)
 * @returns {Promise} - Reto creado
 * @note Axios detecta automáticamente FormData y configura el Content-Type con boundary correcto
 */
export const crearReto = async (formData) => {
  const response = await api.post('/retos/', formData);
  return response.data;
};

/**
 * Actualizar reto existente
 * @param {number} id - ID del reto
 * @param {FormData} formData - Datos del reto (incluye imagen y preguntas)
 * @returns {Promise} - Reto actualizado
 * @note Axios detecta automáticamente FormData y configura el Content-Type con boundary correcto
 */
export const actualizarReto = async (id, formData) => {
  const response = await api.put(`/retos/${id}/`, formData);
  return response.data;
};

/**
 * Eliminar reto
 * @param {number} id - ID del reto
 * @returns {Promise}
 */
export const eliminarReto = async (id) => {
  const response = await api.delete(`/retos/${id}/`);
  return response.data;
};

// ========================================
// SERVICIOS DE TIPS
// ========================================

/**
 * Obtener todos los tips
 * @returns {Promise} - Lista de tips
 */
export const obtenerTips = async () => {
  const response = await api.get('/tips/');
  return response.data;
};

/**
 * Obtener un tip por ID
 * @param {number} id - ID del tip
 * @returns {Promise} - Datos del tip
 */
export const obtenerTip = async (id) => {
  const response = await api.get(`/tips/${id}/`);
  return response.data;
};

/**
 * Crear nuevo tip
 * @param {Object} datos - {id_perfil, nombre, descripcion}
 * @returns {Promise} - Tip creado
 */
export const crearTip = async (datos) => {
  const response = await api.post('/tips/', datos);
  return response.data;
};

/**
 * Actualizar tip existente
 * @param {number} id - ID del tip
 * @param {Object} datos - {id_perfil, nombre, descripcion}
 * @returns {Promise} - Tip actualizado
 */
export const actualizarTip = async (id, datos) => {
  const response = await api.put(`/tips/${id}/`, datos);
  return response.data;
};

/**
 * Eliminar tip
 * @param {number} id - ID del tip
 * @returns {Promise}
 */
export const eliminarTip = async (id) => {
  const response = await api.delete(`/tips/${id}/`);
  return response.data;
};

// ========================================
// SERVICIOS DE PERFILES
// ========================================

/**
 * Obtener todos los perfiles
 * @returns {Promise} - Lista de perfiles
 */
export const obtenerPerfiles = async () => {
  const response = await api.get('/perfiles/');
  return response.data;
};

/**
 * Obtener un perfil por ID
 * @param {number} id - ID del perfil
 * @returns {Promise} - Datos del perfil
 */
export const obtenerPerfil = async (id) => {
  const response = await api.get(`/perfiles/${id}/`);
  return response.data;
};

// ========================================
// SERVICIOS PARA USUARIOS AUTENTICADOS
// ========================================

/**
 * Actualizar perfil del usuario autenticado
 * @param {Object} datos - {nombre_perfil?, contrasena?}
 * @returns {Promise} - Perfil actualizado
 */
export const actualizarMiPerfil = async (datos) => {
  const response = await api.put('/perfil/me/update/', datos);
  return response.data;
};

/**
 * Obtener progreso del usuario autenticado
 * @returns {Promise} - {total_retos, retos_completados, porcentaje_completado}
 */
export const obtenerMiProgreso = async () => {
  const response = await api.get('/perfil/me/progreso/');
  return response.data;
};

/**
 * Obtener progreso por temas del usuario autenticado
 * Retorna el estado de completitud de cada tema
 * @returns {Promise} - Array con {id_tema, nombre_tema, total_retos, retos_completados, esta_completado}
 */
export const obtenerProgresoTemas = async () => {
  const response = await api.get('/perfil/me/progreso-temas/');
  return response.data;
};

/**
 * Obtener retos de un tema con progreso del usuario
 * @param {number} idTema - ID del tema
 * @returns {Promise} - Lista de retos con progreso
 */
export const obtenerRetosDelTema = async (idTema) => {
  const response = await api.get(`/temas/${idTema}/retos/`);
  return response.data;
};

/**
 * Iniciar un reto (comprar con monedas)
 * @param {number} idReto - ID del reto
 * @returns {Promise} - {message, progreso, perfil}
 */
export const iniciarReto = async (idReto) => {
  const response = await api.post(`/retos/${idReto}/iniciar/`);
  return response.data;
};

/**
 * Resolver un reto (enviar respuesta)
 * @param {number} idPerfil - ID del perfil
 * @param {number} idReto - ID del reto
 * @param {string} respuestaSeleccionada - Respuesta elegida
 * @returns {Promise} - Resultado de la validación
 */
export const solucionarReto = async (idPerfil, idReto, respuestaSeleccionada) => {
  const response = await api.post('/solucionar_reto/', {
    id_perfil: idPerfil,
    id_reto: idReto,
    respuesta_seleccionada: respuestaSeleccionada,
  });
  return response.data;
};

// Exportar instancia de API por defecto
export default api;
