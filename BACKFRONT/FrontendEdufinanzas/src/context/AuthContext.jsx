/**
 * Contexto de Autenticación
 * Maneja el estado global de autenticación del usuario en toda la aplicación
 * Gestiona tokens JWT, datos del usuario y permisos
 */
import { createContext, useState, useContext, useEffect } from 'react'
import { login as loginApi } from '../services/api'

const AuthContext = createContext()

/**
 * Hook personalizado para acceder al contexto de autenticación
 * @returns {Object} Contexto de autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}

/**
 * Provider del contexto de autenticación
 * Envuelve la aplicación y proporciona métodos de autenticación
 */
export const AuthProvider = ({ children }) => {
  // Estado del usuario autenticado
  const [usuario, setUsuario] = useState(null)

  // Estado del token JWT
  const [token, setToken] = useState(null)

  // Estado de carga durante la autenticación
  const [loading, setLoading] = useState(true)

  /**
   * Efecto para cargar datos de autenticación del localStorage al iniciar
   */
  useEffect(() => {
    const cargarDatosAutenticacion = () => {
      try {
        const tokenGuardado = localStorage.getItem('token')
        const usuarioGuardado = localStorage.getItem('usuario')

        if (tokenGuardado && usuarioGuardado) {
          setToken(tokenGuardado)
          setUsuario(JSON.parse(usuarioGuardado))
        }
      } catch (error) {
        console.error('Error al cargar datos de autenticación:', error)
        // Si hay error, limpiamos el localStorage
        localStorage.removeItem('token')
        localStorage.removeItem('usuario')
      } finally {
        setLoading(false)
      }
    }

    cargarDatosAutenticacion()
  }, [])

  /**
   * Función para iniciar sesión
   * @param {string} correo - Correo electrónico del usuario
   * @param {string} contrasena - Contraseña del usuario
   * @returns {Promise<Object>} Datos del usuario y resultado de login
   */
  const login = async (correo, contrasena) => {
    try {
      setLoading(true)

      // Llamar a la API de login
      const response = await loginApi(correo, contrasena)

      // El backend debe retornar: { token, usuario: {...}, perfil: {...} }
      const { token: tokenRecibido, usuario: usuarioRecibido, perfil } = response

      // Combinar datos del usuario y perfil
      const datosCompletos = {
        ...usuarioRecibido,
        perfil: perfil,
      }

      // Guardar en el estado
      setToken(tokenRecibido)
      setUsuario(datosCompletos)

      // Persistir en localStorage
      localStorage.setItem('token', tokenRecibido)
      localStorage.setItem('usuario', JSON.stringify(datosCompletos))

      return { success: true, data: datosCompletos }
    } catch (error) {
      console.error('Error en login:', error)

      // Manejar diferentes tipos de errores
      if (error.response?.status === 404) {
        return { success: false, error: 'Usuario no encontrado' }
      } else if (error.response?.status === 401) {
        return { success: false, error: 'Contraseña incorrecta' }
      } else {
        return { success: false, error: 'Error al iniciar sesión. Intenta nuevamente.' }
      }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Función para cerrar sesión
   * Limpia el estado y el localStorage
   */
  const logout = () => {
    setToken(null)
    setUsuario(null)
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
  }

  /**
   * Función para actualizar los datos del usuario en el contexto
   * Útil después de actualizar el perfil
   * @param {Object} nuevosMonedas - Datos actualizados del usuario
   */
  const actualizarUsuario = (nuevosDatos) => {
    const usuarioActualizado = {
      ...usuario,
      ...nuevosDatos,
    }
    setUsuario(usuarioActualizado)
    localStorage.setItem('usuario', JSON.stringify(usuarioActualizado))
  }

  /**
   * Función para actualizar las monedas del usuario
   * @param {number} cantidad - Cantidad de monedas a agregar (puede ser negativa)
   */
  const actualizarMonedas = (cantidad) => {
    if (!usuario?.perfil) return

    const monedasActuales = usuario.perfil.monedas || 0
    const nuevasMonedas = monedasActuales + cantidad

    const usuarioActualizado = {
      ...usuario,
      perfil: {
        ...usuario.perfil,
        monedas: nuevasMonedas,
      },
    }

    setUsuario(usuarioActualizado)
    localStorage.setItem('usuario', JSON.stringify(usuarioActualizado))
  }

  /**
   * Verifica si el usuario está autenticado
   * @returns {boolean} True si hay un usuario autenticado
   */
  const estaAutenticado = () => {
    return !!token && !!usuario
  }

  /**
   * Verifica si el usuario es administrador
   * @returns {boolean} True si el usuario tiene rol de administrador
   */
  const esAdmin = () => {
    return usuario?.rol === 'Administrador'
  }

  /**
   * Obtiene las monedas actuales del usuario
   * @returns {number} Cantidad de monedas
   */
  const obtenerMonedas = () => {
    return usuario?.perfil?.monedas || 0
  }

  /**
   * Obtiene el ID del perfil del usuario
   * @returns {number|null} ID del perfil
   */
  const obtenerIdPerfil = () => {
    return usuario?.perfil?.id_perfil || null
  }

  /**
   * Obtiene el ID del usuario
   * @returns {number|null} ID del usuario
   */
  const obtenerIdUsuario = () => {
    return usuario?.id_usuario || null
  }

  /**
   * Obtiene el nombre del perfil
   * @returns {string} Nombre del perfil
   */
  const obtenerNombrePerfil = () => {
    return usuario?.perfil?.nombre_perfil || 'Usuario'
  }

  // Valor del contexto que se provee a todos los componentes
  const value = {
    usuario,
    token,
    loading,
    login,
    logout,
    actualizarUsuario,
    actualizarMonedas,
    estaAutenticado,
    esAdmin,
    obtenerMonedas,
    obtenerIdPerfil,
    obtenerIdUsuario,
    obtenerNombrePerfil,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
