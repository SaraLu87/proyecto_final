/**
 * PÁGINA: GESTIÓN DE TIPS (CRUD)
 *
 * Módulo completo para administrar tips periódicas
 * - Ver lista de todos los tips
 * - Crear nuevo tip
 * - Editar tip existente
 * - Eliminar tip
 */

import { useState, useEffect } from 'react';
import {
  obtenerTips,
  crearTip,
  actualizarTip,
  eliminarTip
} from '../../services/api';
import './Usuarios.css';

const Tips = () => {
  const [tips, setTips] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [tipActual, setTipActual] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
  });

  useEffect(() => {
    cargarTips();
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

  const cargarTips = async () => {
    try {
      setCargando(true);
      setError('');
      const data = await obtenerTips();
      setTips(data);
    } catch (err) {
      console.error('Error al cargar tips:', err);
      setError('Error al cargar los tips');
    } finally {
      setCargando(false);
    }
  };

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setTipActual(null);
    setFormData({
      nombre: '',
      descripcion: '',
    });
    setModalAbierto(true);
  };

  const abrirModalEditar = (tip) => {
    setModoEdicion(true);
    setTipActual(tip);
    setFormData({
      nombre: tip.nombre,
      descripcion: tip.descripcion,
    });
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setModoEdicion(false);
    setTipActual(null);
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
      };

      if (modoEdicion) {
        await actualizarTip(tipActual.id_recompensa, datosEnviar);
        setExito('Tip actualizado correctamente');
      } else {
        await crearTip(datosEnviar);
        setExito('Tip creado correctamente');
      }

      cerrarModal();
      await cargarTips();
    } catch (err) {
      console.error('Error al guardar tip:', err);

      // Si es error 404, el tip ya no existe - recargar lista
      if (err.response?.status === 404) {
        setError('El tip ya no existe. Recargando lista...');
        cerrarModal();
        await cargarTips();
      } else {
        setError(err.response?.data?.message || 'Error al guardar el tip');
      }
    }
  };

  const handleEliminar = async (tip) => {
    const confirmacion = window.confirm(
      `¿Estás seguro de eliminar el tip "${tip.nombre}"?`
    );
    if (!confirmacion) return;

    try {
      setError('');
      setExito('');
      await eliminarTip(tip.id_recompensa);
      setExito('Tip eliminado correctamente');
      await cargarTips();
    } catch (err) {
      console.error('Error al eliminar tip:', err);

      // Si es error 404, el tip ya no existe - recargar lista
      if (err.response?.status === 404) {
        setError('El tip ya no existe. Recargando lista...');
        await cargarTips();
      } else if (err.response?.status === 500) {
        // Manejar error de foreign key constraint
        const detail = err.response?.data?.detail || '';

        if (detail.includes('foreign key') || detail.includes('IntegrityError')) {
          setError(
            'No se puede eliminar este tip porque tiene datos relacionados. ' +
            'Primero elimina los registros dependientes.'
          );
        } else {
          setError('Error del servidor al eliminar el tip');
        }
      } else {
        setError('Error al eliminar el tip');
        // Recargar de todas formas por si hubo cambios
        await cargarTips();
      }
    }
  };

  const tipsFiltrados = tips.filter((tip) =>
    tip.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    tip.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (cargando && tips.length === 0) {
    return (
      <div className="tips-container">
        <div className="loader">
          <div className="spinner"></div>
          <p>Cargando tips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tips-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestión de Tips</h1>
          <p className="page-subtitle">
            Administra los tips financieras periódicas
          </p>
        </div>
        <button className="btn btn-primary" onClick={abrirModalCrear}>
          <span>➕</span>
          <span>Crear Tip</span>
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
          placeholder="Buscar tip..."
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
              <th>ID Perfil</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tipsFiltrados.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No se encontraron tips
                </td>
              </tr>
            ) : (
              tipsFiltrados.map((tip) => (
                <tr key={tip.id_recompensa}>
                  <td>{tip.id_recompensa}</td>
                  <td>{tip.nombre}</td>
                  <td>{tip.descripcion.substring(0, 60)}...</td>
                  <td>{tip.id_perfil}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-action btn-edit"
                        onClick={() => abrirModalEditar(tip)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleEliminar(tip)}
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
                {modoEdicion ? 'Editar Tip' : 'Crear Nuevo Tip'}
              </h2>
              <button className="modal-close" onClick={cerrarModal}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="nombre" className="form-label">
                  Nombre del Tip *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Consejo de Ahorro Mensual"
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
                  placeholder="Escribe el contenido del tip"
                  className="form-control"
                  rows="5"
                  required
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

export default Tips;
