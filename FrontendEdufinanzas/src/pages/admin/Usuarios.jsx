/**
 * PÁGINA: GESTIÓN DE USUARIOS (CRUD)
 *
 * Módulo completo para administrar usuarios
 * - Ver lista de todos los usuarios
 * - Crear nuevo usuario
 * - Editar usuario existente
 * - Actualizar rol de usuario
 * - Eliminar usuario
 * - Modal para formularios
 * - Búsqueda y filtros
 */

import { useState, useEffect } from 'react';
import {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
} from '../../services/api';
import './Usuarios.css';

const Usuarios = () => {
  // Estados principales
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  // Estados del modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState(null);

  // Estados del formulario
  const [formData, setFormData] = useState({
    correo: '',
    contrasena: '',
    rol: 'Usuario',
  });

  // Estado de búsqueda
  const [busqueda, setBusqueda] = useState('');

  /**
   * Cargar usuarios al montar el componente
   */
  useEffect(() => {
    cargarUsuarios();
  }, []);

  /**
   * Auto-ocultar mensajes después de 5 segundos
   */
  useEffect(() => {
    if (exito || error) {
      const timer = setTimeout(() => {
        setExito('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [exito, error]);

  /**
   * Cargar todos los usuarios desde la API
   */
  const cargarUsuarios = async () => {
    try {
      setCargando(true);
      setError('');
      const data = await obtenerUsuarios();
      setUsuarios(data);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setError('Error al cargar los usuarios');
    } finally {
      setCargando(false);
    }
  };

  /**
   * Abrir modal para crear usuario
   */
  const abrirModalCrear = () => {
    setModoEdicion(false);
    setUsuarioActual(null);
    setFormData({
      correo: '',
      contrasena: '',
      rol: 'Usuario',
    });
    setModalAbierto(true);
  };

  /**
   * Abrir modal para editar usuario
   */
  const abrirModalEditar = (usuario) => {
    setModoEdicion(true);
    setUsuarioActual(usuario);
    setFormData({
      correo: usuario.correo,
      contrasena: '',
      rol: usuario.rol,
    });
    setModalAbierto(true);
  };

  /**
   * Cerrar modal
   */
  const cerrarModal = () => {
    setModalAbierto(false);
    setModoEdicion(false);
    setUsuarioActual(null);
    setFormData({
      correo: '',
      contrasena: '',
      rol: 'Usuario',
    });
  };

  /**
   * Manejar cambios en el formulario
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  /**
   * Manejar envío del formulario (crear o editar)
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');

    try {
      // Validar campos
      if (!formData.correo.trim()) {
        setError('El correo es obligatorio');
        return;
      }

      if (!modoEdicion && !formData.contrasena.trim()) {
        setError('La contraseña es obligatoria');
        return;
      }

      // Crear datos para enviar
      const datosEnviar = {
        correo: formData.correo,
        rol: formData.rol,
      };

      // Solo incluir contraseña si no está vacía
      if (formData.contrasena.trim()) {
        datosEnviar.contrasena = formData.contrasena;
      }

      if (modoEdicion) {
        // Actualizar usuario existente
        await actualizarUsuario(usuarioActual.id_usuario, datosEnviar);
        setExito('Usuario actualizado correctamente');
      } else {
        // Crear nuevo usuario
        await crearUsuario(datosEnviar);
        setExito('Usuario creado correctamente');
      }

      // Recargar lista de usuarios
      await cargarUsuarios();

      // Cerrar modal
      cerrarModal();
    } catch (err) {
      console.error('Error al guardar usuario:', err);
      const mensaje = err.response?.data?.message || 'Error al guardar el usuario';
      setError(mensaje);
    }
  };

  /**
   * Eliminar usuario con confirmación
   */
  const handleEliminar = async (usuario) => {
    // Confirmación
    const confirmacion = window.confirm(
      `¿Estás seguro de eliminar al usuario ${usuario.correo}?`
    );

    if (!confirmacion) return;

    try {
      setError('');
      setExito('');

      await eliminarUsuario(usuario.id_usuario);
      setExito('Usuario eliminado correctamente');

      // Recargar lista de usuarios
      await cargarUsuarios();
    } catch (err) {
      console.error('Error al eliminar usuario:', err);

      // Manejar error de foreign key constraint
      if (err.response?.status === 500) {
        const detail = err.response?.data?.detail || '';

        if (detail.includes('foreign key') || detail.includes('IntegrityError')) {
          setError(
            'No se puede eliminar este usuario porque tiene datos relacionados ' +
            '(perfiles, tips, progreso). Primero elimina los registros dependientes.'
          );
        } else {
          setError('Error del servidor al eliminar el usuario');
        }
      } else {
        setError('Error al eliminar el usuario');
      }
    }
  };

  /**
   * Filtrar usuarios por búsqueda
   */
  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.correo.toLowerCase().includes(busqueda.toLowerCase()) ||
    usuario.rol.toLowerCase().includes(busqueda.toLowerCase())
  );

  /**
   * Renderizar loader
   */
  if (cargando && usuarios.length === 0) {
    return (
      <div className="usuarios-container">
        <div className="loader">
          <div className="spinner"></div>
          <p>Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="usuarios-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestión de Usuarios</h1>
          <p className="page-subtitle">
            Administra todos los usuarios de la plataforma
          </p>
        </div>
        <button className="btn btn-primary" onClick={abrirModalCrear}>
          <span>➕</span>
          <span>Crear Usuario</span>
        </button>
      </div>

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

      {/* Barra de búsqueda */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por correo o rol..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="search-input"
        />
        <span className="search-icon">🔍</span>
      </div>

      {/* Tabla de usuarios */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Fecha de Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No se encontraron usuarios
                </td>
              </tr>
            ) : (
              usuariosFiltrados.map((usuario) => (
                <tr key={usuario.id_usuario}>
                  <td>{usuario.id_usuario}</td>
                  <td>{usuario.correo}</td>
                  <td>
                    <span className={`badge badge-${usuario.rol.toLowerCase()}`}>
                      {usuario.rol}
                    </span>
                  </td>
                  <td>
                    {new Date(usuario.fecha_registro).toLocaleDateString('es-ES')}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-action btn-edit"
                        onClick={() => abrirModalEditar(usuario)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleEliminar(usuario)}
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para crear/editar */}
      {modalAbierto && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {modoEdicion ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
              </h2>
              <button className="modal-close" onClick={cerrarModal}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              {/* Correo */}
              <div className="form-group">
                <label htmlFor="correo" className="form-label">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  placeholder="usuario@ejemplo.com"
                  className="form-control"
                  required
                />
              </div>

              {/* Contraseña */}
              <div className="form-group">
                <label htmlFor="contrasena" className="form-label">
                  Contraseña {modoEdicion && '(dejar en blanco para no cambiar)'}
                </label>
                <input
                  type="password"
                  id="contrasena"
                  name="contrasena"
                  value={formData.contrasena}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="form-control"
                  required={!modoEdicion}
                />
              </div>

              {/* Rol */}
              <div className="form-group">
                <label htmlFor="rol" className="form-label">
                  Rol *
                </label>
                <select
                  id="rol"
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="Usuario">Usuario</option>
                  <option value="Administrador">Administrador</option>
                </select>
              </div>

              {/* Botones */}
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {modoEdicion ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;
