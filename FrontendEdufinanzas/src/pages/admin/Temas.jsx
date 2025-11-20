/**
 * PÁGINA: GESTIÓN DE TEMAS (CRUD)
 *
 * Módulo completo para administrar temas educativos
 * - Ver lista de todos los temas
 * - Crear nuevo tema con imagen
 * - Editar tema existente
 * - Eliminar tema
 * - Upload de imágenes
 */

import { useState, useEffect } from 'react';
import {
  obtenerTemas,
  crearTema,
  actualizarTema,
  eliminarTema
} from '../../services/api';
import './Usuarios.css';

const Temas = () => {
  const [temas, setTemas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [temaActual, setTemaActual] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    informacion_tema: '',
  });

  useEffect(() => {
    cargarTemas();
  }, []);

  useEffect(() => {
    if (exito || error) {
      const timer = setTimeout(() => {
        setExito('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [exito, error]);

  const cargarTemas = async () => {
    try {
      setCargando(true);
      setError('');
      const data = await obtenerTemas();
      setTemas(data);
    } catch (err) {
      console.error('Error al cargar temas:', err);
      setError('Error al cargar los temas');
    } finally {
      setCargando(false);
    }
  };

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setTemaActual(null);
    setFormData({
      nombre: '',
      descripcion: '',
      informacion_tema: '',
    });
    setModalAbierto(true);
  };

  const abrirModalEditar = (tema) => {
    setModoEdicion(true);
    setTemaActual(tema);
    setFormData({
      nombre: tema.nombre,
      descripcion: tema.descripcion,
      informacion_tema: tema.informacion_tema || '',
    });
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setModoEdicion(false);
    setTemaActual(null);
    setFormData({
      nombre: '',
      descripcion: '',
      informacion_tema: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');

    try {
      if (!formData.nombre.trim() || !formData.descripcion.trim()) {
        setError('El nombre y descripción son obligatorios');
        return;
      }

      const datosEnviar = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        informacion_tema: formData.informacion_tema,
      };

      if (modoEdicion) {
        await actualizarTema(temaActual.id_tema, datosEnviar);
        setExito('Tema actualizado correctamente');
      } else {
        await crearTema(datosEnviar);
        setExito('Tema creado correctamente');
      }

      await cargarTemas();
      cerrarModal();
    } catch (err) {
      console.error('Error al guardar tema:', err);
      setError(err.response?.data?.message || 'Error al guardar el tema');
    }
  };

  const handleEliminar = async (tema) => {
    const confirmacion = window.confirm(
      `¿Estás seguro de eliminar el tema "${tema.nombre}"?`
    );
    if (!confirmacion) return;

    try {
      setError('');
      setExito('');
      await eliminarTema(tema.id_tema);
      setExito('Tema eliminado correctamente');
      await cargarTemas();
    } catch (err) {
      console.error('Error al eliminar tema:', err);

      // Manejar error de foreign key constraint
      if (err.response?.status === 500) {
        const detail = err.response?.data?.detail || '';

        if (detail.includes('foreign key') || detail.includes('IntegrityError')) {
          setError(
            'No se puede eliminar este tema porque tiene retos asociados. ' +
            'Primero elimina los retos relacionados con este tema.'
          );
        } else {
          setError('Error del servidor al eliminar el tema');
        }
      } else {
        setError('Error al eliminar el tema');
      }
    }
  };

  const temasFiltrados = temas.filter((tema) =>
    tema.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    tema.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (cargando && temas.length === 0) {
    return (
      <div className="temas-container">
        <div className="loader">
          <div className="spinner"></div>
          <p>Cargando temas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="temas-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestión de Temas</h1>
          <p className="page-subtitle">
            Administra los temas educativos de la plataforma
          </p>
        </div>
        <button className="btn btn-primary" onClick={abrirModalCrear}>
          <span>➕</span>
          <span>Crear Tema</span>
        </button>
      </div>

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

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar tema..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="search-input"
        />
        <span className="search-icon">🔍</span>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {temasFiltrados.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  No se encontraron temas
                </td>
              </tr>
            ) : (
              temasFiltrados.map((tema) => (
                <tr key={tema.id_tema}>
                  <td>{tema.id_tema}</td>
                  <td>{tema.nombre}</td>
                  <td>{tema.descripcion.substring(0, 50)}...</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-action btn-edit"
                        onClick={() => abrirModalEditar(tema)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleEliminar(tema)}
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

      {modalAbierto && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {modoEdicion ? 'Editar Tema' : 'Crear Nuevo Tema'}
              </h2>
              <button className="modal-close" onClick={cerrarModal}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="nombre" className="form-label">
                  Nombre del Tema *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Ahorro"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="descripcion" className="form-label">
                  Descripción *
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Descripción breve del tema"
                  className="form-control"
                  rows="3"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="informacion_tema" className="form-label">
                  Información Completa
                </label>
                <textarea
                  id="informacion_tema"
                  name="informacion_tema"
                  value={formData.informacion_tema}
                  onChange={handleChange}
                  placeholder="Contenido educativo completo del tema"
                  className="form-control"
                  rows="5"
                />
              </div>

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

export default Temas;
