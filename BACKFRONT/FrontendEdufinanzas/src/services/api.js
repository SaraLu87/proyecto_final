/**
 * Servicio de conexión con la API del backend Django
 * Centraliza todas las peticiones HTTP usando Axios
 *
 * CONFIGURACIÓN IMPORTANTE:
 * - Asegúrate de que el backend esté corriendo en http://localhost:8000
 * - El backend debe tener CORS configurado para permitir peticiones desde el frontend
 * - Las imágenes se sirven desde: http://localhost:8000/media/
 */

import axios from 'axios'

// URL base del backend Django
const API_BASE_URL = 'http://localhost:8000/api'

// URL base para archivos media (imágenes)
export const MEDIA_BASE_URL = 'http://localhost:8000/media'

/**
 * Instancia de Axios configurada con la URL base
 * Incluye interceptores para manejo automático de tokens JWT
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Interceptor de peticiones - Agrega el token JWT a todas las peticiones
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Interceptor de respuestas - Maneja errores de autenticación
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el token ha expirado o no es válido, redirigir al login
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// =============================================
// SERVICIOS DE AUTENTICACIÓN
// =============================================

/**
 * Inicia sesión de un usuario
 * @param {string} correo - Correo electrónico del usuario
 * @param {string} contrasena - Contraseña del usuario
 * @returns {Promise} Datos del usuario y token JWT
 */
export const login = async (correo, contrasena) => {
  const response = await apiClient.post('/login_usuario/', {
    correo,
    contrasena,
  })
  return response.data
}

/**
 * Registra un nuevo usuario y su perfil
 * @param {Object} userData - Datos del usuario y perfil
 * @returns {Promise} Usuario creado
 */
export const register = async (userData) => {
  const response = await apiClient.post('/usuarios/', userData)
  return response.data
}

// =============================================
// SERVICIOS DE USUARIOS
// =============================================

/**
 * Obtiene la lista de todos los usuarios (solo admin)
 * @returns {Promise} Lista de usuarios
 */
export const obtenerUsuarios = async () => {
  const response = await apiClient.get('/usuarios/')
  return response.data
}

/**
 * Obtiene un usuario por ID
 * @param {number} idUsuario - ID del usuario
 * @returns {Promise} Datos del usuario
 */
export const obtenerUsuario = async (idUsuario) => {
  const response = await apiClient.get(`/usuarios/${idUsuario}/`)
  return response.data
}

/**
 * Actualiza los datos de un usuario
 * @param {number} idUsuario - ID del usuario
 * @param {Object} userData - Datos a actualizar
 * @returns {Promise} Usuario actualizado
 */
export const actualizarUsuario = async (idUsuario, userData) => {
  const response = await apiClient.put(`/usuarios/${idUsuario}/`, userData)
  return response.data
}

/**
 * Elimina un usuario
 * @param {number} idUsuario - ID del usuario
 * @returns {Promise} Confirmación de eliminación
 */
export const eliminarUsuario = async (idUsuario) => {
  const response = await apiClient.delete(`/usuarios/${idUsuario}/`)
  return response.data
}

// =============================================
// SERVICIOS DE PERFILES
// =============================================

/**
 * Obtiene todos los perfiles
 * @returns {Promise} Lista de perfiles
 */
export const obtenerPerfiles = async () => {
  const response = await apiClient.get('/perfiles/')
  return response.data
}

/**
 * Obtiene un perfil por ID
 * @param {number} idPerfil - ID del perfil
 * @returns {Promise} Datos del perfil
 */
export const obtenerPerfil = async (idPerfil) => {
  const response = await apiClient.get(`/perfiles/${idPerfil}/`)
  return response.data
}

/**
 * Crea un nuevo perfil
 * @param {Object} perfilData - Datos del perfil
 * @returns {Promise} Perfil creado
 */
export const crearPerfil = async (perfilData) => {
  const response = await apiClient.post('/perfiles/', perfilData)
  return response.data
}

/**
 * Actualiza un perfil existente
 * @param {number} idPerfil - ID del perfil
 * @param {Object} perfilData - Datos a actualizar
 * @returns {Promise} Perfil actualizado
 */
export const actualizarPerfil = async (idPerfil, perfilData) => {
  const response = await apiClient.put(`/perfiles/${idPerfil}/`, perfilData)
  return response.data
}

/**
 * Actualiza la foto de perfil
 * NOTA: Esta función envía FormData para subir imágenes
 * @param {number} idPerfil - ID del perfil
 * @param {File} file - Archivo de imagen
 * @returns {Promise} Perfil actualizado
 */
export const actualizarFotoPerfil = async (idPerfil, file) => {
  const formData = new FormData()
  formData.append('foto_perfil', file)

  const response = await apiClient.patch(`/perfiles/${idPerfil}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

// =============================================
// SERVICIOS DE TEMAS
// =============================================

/**
 * Obtiene todos los temas disponibles
 * @returns {Promise} Lista de temas
 */
export const obtenerTemas = async () => {
  const response = await apiClient.get('/temas/')
  return response.data
}

/**
 * Obtiene un tema por ID
 * @param {number} idTema - ID del tema
 * @returns {Promise} Datos del tema
 */
export const obtenerTema = async (idTema) => {
  const response = await apiClient.get(`/temas/${idTema}/`)
  return response.data
}

/**
 * Crea un nuevo tema (solo admin)
 * @param {Object} temaData - Datos del tema
 * @returns {Promise} Tema creado
 */
export const crearTema = async (temaData) => {
  const response = await apiClient.post('/temas/', temaData)
  return response.data
}

/**
 * Actualiza un tema existente (solo admin)
 * @param {number} idTema - ID del tema
 * @param {Object} temaData - Datos a actualizar
 * @returns {Promise} Tema actualizado
 */
export const actualizarTema = async (idTema, temaData) => {
  const response = await apiClient.put(`/temas/${idTema}/`, temaData)
  return response.data
}

/**
 * Elimina un tema (solo admin)
 * @param {number} idTema - ID del tema
 * @returns {Promise} Confirmación de eliminación
 */
export const eliminarTema = async (idTema) => {
  const response = await apiClient.delete(`/temas/${idTema}/`)
  return response.data
}

// =============================================
// SERVICIOS DE RETOS
// =============================================

/**
 * Obtiene todos los retos
 * @returns {Promise} Lista de retos
 */
export const obtenerRetos = async () => {
  const response = await apiClient.get('/retos/')
  return response.data
}

/**
 * Obtiene un reto por ID
 * @param {number} idReto - ID del reto
 * @returns {Promise} Datos del reto
 */
export const obtenerReto = async (idReto) => {
  const response = await apiClient.get(`/retos/${idReto}/`)
  return response.data
}

/**
 * Obtiene los retos de un tema específico
 * @param {number} idTema - ID del tema
 * @returns {Promise} Lista de retos del tema
 */
export const obtenerRetosPorTema = async (idTema) => {
  const response = await apiClient.get(`/retos/?id_tema=${idTema}`)
  return response.data
}

/**
 * Crea un nuevo reto (solo admin)
 * @param {Object} retoData - Datos del reto
 * @returns {Promise} Reto creado
 */
export const crearReto = async (retoData) => {
  const response = await apiClient.post('/retos/', retoData)
  return response.data
}

/**
 * Actualiza un reto existente (solo admin)
 * @param {number} idReto - ID del reto
 * @param {Object} retoData - Datos a actualizar
 * @returns {Promise} Reto actualizado
 */
export const actualizarReto = async (idReto, retoData) => {
  const response = await apiClient.put(`/retos/${idReto}/`, retoData)
  return response.data
}

/**
 * Elimina un reto (solo admin)
 * @param {number} idReto - ID del reto
 * @returns {Promise} Confirmación de eliminación
 */
export const eliminarReto = async (idReto) => {
  const response = await apiClient.delete(`/retos/${idReto}/`)
  return response.data
}

/**
 * Soluciona un reto - envía la respuesta del usuario
 * @param {Object} solucionData - Datos de la solución
 * @returns {Promise} Resultado de la solución
 */
export const solucionarReto = async (solucionData) => {
  const response = await apiClient.post('/solucionar_reto/', solucionData)
  return response.data
}

// =============================================
// SERVICIOS DE TIPS PERIÓDICOS
// =============================================

/**
 * Obtiene todos los tips periódicos
 * @returns {Promise} Lista de tips
 */
export const obtenerTips = async () => {
  const response = await apiClient.get('/tips/')
  return response.data
}

/**
 * Obtiene un tip por ID
 * @param {number} idTip - ID del tip
 * @returns {Promise} Datos del tip
 */
export const obtenerTip = async (idTip) => {
  const response = await apiClient.get(`/tips/${idTip}/`)
  return response.data
}

/**
 * Crea un nuevo tip (solo admin)
 * @param {Object} tipData - Datos del tip
 * @returns {Promise} Tip creado
 */
export const crearTip = async (tipData) => {
  const response = await apiClient.post('/tips/', tipData)
  return response.data
}

/**
 * Actualiza un tip existente (solo admin)
 * @param {number} idTip - ID del tip
 * @param {Object} tipData - Datos a actualizar
 * @returns {Promise} Tip actualizado
 */
export const actualizarTip = async (idTip, tipData) => {
  const response = await apiClient.put(`/tips/${idTip}/`, tipData)
  return response.data
}

/**
 * Elimina un tip (solo admin)
 * @param {number} idTip - ID del tip
 * @returns {Promise} Confirmación de eliminación
 */
export const eliminarTip = async (idTip) => {
  const response = await apiClient.delete(`/tips/${idTip}/`)
  return response.data
}

// =============================================
// SERVICIOS DE PROGRESO
// =============================================

/**
 * Obtiene el progreso de un perfil
 * @param {number} idPerfil - ID del perfil
 * @returns {Promise} Lista de progresos
 */
export const obtenerProgresoPerfil = async (idPerfil) => {
  const response = await apiClient.get(`/progresos/?id_perfil=${idPerfil}`)
  return response.data
}

/**
 * Obtiene un progreso específico por ID
 * @param {number} idProgreso - ID del progreso
 * @returns {Promise} Datos del progreso
 */
export const obtenerProgreso = async (idProgreso) => {
  const response = await apiClient.get(`/progresos/${idProgreso}/`)
  return response.data
}

/**
 * Crea un nuevo registro de progreso
 * @param {Object} progresoData - Datos del progreso
 * @returns {Promise} Progreso creado
 */
export const crearProgreso = async (progresoData) => {
  const response = await apiClient.post('/progresos/', progresoData)
  return response.data
}

/**
 * Actualiza un progreso existente
 * @param {number} idProgreso - ID del progreso
 * @param {Object} progresoData - Datos a actualizar
 * @returns {Promise} Progreso actualizado
 */
export const actualizarProgreso = async (idProgreso, progresoData) => {
  const response = await apiClient.put(`/progresos/${idProgreso}/`, progresoData)
  return response.data
}

/**
 * Obtiene el progreso de un reto específico para un perfil
 * @param {number} idPerfil - ID del perfil
 * @param {number} idReto - ID del reto
 * @returns {Promise} Datos del progreso
 */
export const obtenerProgresoReto = async (idPerfil, idReto) => {
  const response = await apiClient.get(`/progresos/?id_perfil=${idPerfil}&id_reto=${idReto}`)
  return response.data
}

// =============================================
// UTILIDADES
// =============================================

/**
 * Construye la URL completa para una imagen del backend
 * @param {string} imagePath - Ruta relativa de la imagen (ej: "temas/imagen.png")
 * @returns {string} URL completa de la imagen
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null
  if (imagePath.startsWith('http')) return imagePath
  return `${MEDIA_BASE_URL}/${imagePath}`
}

export default apiClient
