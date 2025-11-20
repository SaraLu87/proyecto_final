/**
 * PÁGINA: GESTIÓN DE RETOS (CRUD)
 *
 * Módulo completo para administrar retos/desafíos
 * - Ver lista de todos los retos
 * - Crear nuevo reto con preguntas (4 opciones, 1 correcta)
 * - Editar reto existente
 * - Eliminar reto
 * - Asociar retos a temas
 * - Gestión de recompensas y costos en monedas
 */

import { useState, useEffect } from 'react';
import {
  obtenerRetos,
  crearReto,
  actualizarReto,
  eliminarReto,
  obtenerTemas
} from '../../services/api';
import './Usuarios.css';

const Retos = () => {
  const [retos, setRetos] = useState([]);
  const [temas, setTemas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [retoActual, setRetoActual] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  const [formData, setFormData] = useState({
    nombre_reto: '',
    id_tema: '',
    descripcion: '',
    pregunta: '',
    respuesta_uno: '',
    respuesta_dos: '',
    respuesta_tres: '',
    respuesta_cuatro: '',
    respuestaCorrecta: '',
    recompensa_monedas: 10,
    costo_monedas: 5,
    img_reto: null,
  });

  useEffect(() => {
    cargarDatos();
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

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError('');
      const [dataRetos, dataTemas] = await Promise.all([
        obtenerRetos(),
        obtenerTemas()
      ]);
      setRetos(dataRetos);
      setTemas(dataTemas);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('Error al cargar los retos');
    } finally {
      setCargando(false);
    }
  };

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setRetoActual(null);
    setFormData({
      nombre_reto: '',
      id_tema: temas.length > 0 ? temas[0].id_tema : '',
      descripcion: '',
      pregunta: '',
      respuesta_uno: '',
      respuesta_dos: '',
      respuesta_tres: '',
      respuesta_cuatro: '',
      respuestaCorrecta: '',
      recompensa_monedas: 10,
      costo_monedas: 5,
      img_reto: null,
    });
    setModalAbierto(true);
  };

  const abrirModalEditar = (reto) => {
    setModoEdicion(true);
    setRetoActual(reto);
    setFormData({
      nombre_reto: reto.nombre_reto,
      id_tema: reto.id_tema,
      descripcion: reto.descripcion,
      pregunta: reto.pregunta,
      respuesta_uno: reto.respuesta_uno,
      respuesta_dos: reto.respuesta_dos,
      respuesta_tres: reto.respuesta_tres,
      respuesta_cuatro: reto.respuesta_cuatro,
      respuestaCorrecta: reto.respuestaCorrecta,
      recompensa_monedas: reto.recompensa_monedas,
      costo_monedas: reto.costo_monedas,
      img_reto: null,
    });
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setModoEdicion(false);
    setRetoActual(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      img_reto: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');

    try {
      // Validaciones
      if (!formData.nombre_reto.trim() || !formData.descripcion.trim() || !formData.pregunta.trim()) {
        setError('Nombre, descripción y pregunta son obligatorios');
        return;
      }

      if (!formData.respuesta_uno || !formData.respuesta_dos || !formData.respuesta_tres || !formData.respuesta_cuatro) {
        setError('Todas las opciones de respuesta son obligatorias');
        return;
      }

      if (!formData.respuestaCorrecta) {
        setError('Debes seleccionar la respuesta correcta');
        return;
      }

      // Crear FormData
      const dataToSend = new FormData();
      dataToSend.append('nombre_reto', formData.nombre_reto);
      dataToSend.append('id_tema', formData.id_tema);
      dataToSend.append('descripcion', formData.descripcion);
      dataToSend.append('pregunta', formData.pregunta);
      dataToSend.append('respuesta_uno', formData.respuesta_uno);
      dataToSend.append('respuesta_dos', formData.respuesta_dos);
      dataToSend.append('respuesta_tres', formData.respuesta_tres);
      dataToSend.append('respuesta_cuatro', formData.respuesta_cuatro);
      dataToSend.append('respuestaCorrecta', formData.respuestaCorrecta);
      dataToSend.append('recompensa_monedas', formData.recompensa_monedas);
      dataToSend.append('costo_monedas', formData.costo_monedas);

      if (formData.img_reto) {
        dataToSend.append('img_reto', formData.img_reto);
      }

      if (modoEdicion) {
        await actualizarReto(retoActual.id_reto, dataToSend);
        setExito('Reto actualizado correctamente');
      } else {
        await crearReto(dataToSend);
        setExito('Reto creado correctamente');
      }

      await cargarDatos();
      cerrarModal();
    } catch (err) {
      console.error('Error al guardar reto:', err);
      setError(err.response?.data?.message || 'Error al guardar el reto');
    }
  };

  const handleEliminar = async (reto) => {
    const confirmacion = window.confirm(
      `¿Estás seguro de eliminar el reto "${reto.nombre_reto}"?`
    );
    if (!confirmacion) return;

    try {
      setError('');
      setExito('');
      await eliminarReto(reto.id_reto);
      setExito('Reto eliminado correctamente');
      await cargarDatos();
    } catch (err) {
      console.error('Error al eliminar reto:', err);

      // Manejar error de foreign key constraint
      if (err.response?.status === 500) {
        const detail = err.response?.data?.detail || '';

        if (detail.includes('foreign key') || detail.includes('IntegrityError')) {
          setError(
            'No se puede eliminar este reto porque tiene datos relacionados ' +
            '(progreso de usuarios). Primero elimina los registros dependientes.'
          );
        } else {
          setError('Error del servidor al eliminar el reto');
        }
      } else {
        setError('Error al eliminar el reto');
      }
    }
  };

  const retosFiltrados = retos.filter((reto) =>
    reto.nombre_reto.toLowerCase().includes(busqueda.toLowerCase()) ||
    reto.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  const obtenerNombreTema = (idTema) => {
    const tema = temas.find(t => t.id_tema === idTema);
    return tema ? tema.nombre : 'N/A';
  };

  if (cargando && retos.length === 0) {
    return (
      <div className="retos-container">
        <div className="loader">
          <div className="spinner"></div>
          <p>Cargando retos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="retos-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestión de Retos</h1>
          <p className="page-subtitle">
            Administra los desafíos y preguntas de la plataforma
          </p>
        </div>
        <button className="btn btn-primary" onClick={abrirModalCrear}>
          <span>➕</span>
          <span>Crear Reto</span>
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
          placeholder="Buscar reto..."
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
              <th>Tema</th>
              <th>Descripción</th>
              <th>Recompensa</th>
              <th>Costo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {retosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No se encontraron retos
                </td>
              </tr>
            ) : (
              retosFiltrados.map((reto) => (
                <tr key={reto.id_reto}>
                  <td>{reto.id_reto}</td>
                  <td>{reto.nombre_reto}</td>
                  <td>{obtenerNombreTema(reto.id_tema)}</td>
                  <td>{reto.descripcion.substring(0, 40)}...</td>
                  <td>🪙 {reto.recompensa_monedas}</td>
                  <td>🪙 {reto.costo_monedas}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-action btn-edit"
                        onClick={() => abrirModalEditar(reto)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleEliminar(reto)}
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: '700px'}}>
            <div className="modal-header">
              <h2 className="modal-title">
                {modoEdicion ? 'Editar Reto' : 'Crear Nuevo Reto'}
              </h2>
              <button className="modal-close" onClick={cerrarModal}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              {/* Información básica */}
              <div style={{padding: '1rem', background: '#f3f4f6', borderRadius: '8px', marginBottom: '1rem'}}>
                <h3 style={{fontSize: '1.1rem', marginBottom: '1rem'}}>📝 Información Básica</h3>

                <div className="form-group">
                  <label htmlFor="nombre_reto" className="form-label">Título del Reto *</label>
                  <input
                    type="text"
                    id="nombre_reto"
                    name="nombre_reto"
                    value={formData.nombre_reto}
                    onChange={handleChange}
                    placeholder="Ej: Desafío de Ahorro"
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="id_tema" className="form-label">Tema Asociado *</label>
                  <select
                    id="id_tema"
                    name="id_tema"
                    value={formData.id_tema}
                    onChange={handleChange}
                    className="form-control"
                    required
                  >
                    {temas.map(tema => (
                      <option key={tema.id_tema} value={tema.id_tema}>
                        {tema.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="descripcion" className="form-label">Descripción *</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    placeholder="Describe el reto"
                    className="form-control"
                    rows="3"
                    required
                  />
                </div>

                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                  <div className="form-group">
                    <label htmlFor="recompensa_monedas" className="form-label">Recompensa (monedas) *</label>
                    <input
                      type="number"
                      id="recompensa_monedas"
                      name="recompensa_monedas"
                      value={formData.recompensa_monedas}
                      onChange={handleChange}
                      min="0"
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="costo_monedas" className="form-label">Costo (monedas) *</label>
                    <input
                      type="number"
                      id="costo_monedas"
                      name="costo_monedas"
                      value={formData.costo_monedas}
                      onChange={handleChange}
                      min="0"
                      className="form-control"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Preguntas */}
              <div style={{padding: '1rem', background: '#f3f4f6', borderRadius: '8px'}}>
                <h3 style={{fontSize: '1.1rem', marginBottom: '1rem'}}>❓ Preguntas del Reto</h3>

                <div className="form-group">
                  <label htmlFor="pregunta" className="form-label">Pregunta *</label>
                  <textarea
                    id="pregunta"
                    name="pregunta"
                    value={formData.pregunta}
                    onChange={handleChange}
                    placeholder="Escribe la pregunta del reto"
                    className="form-control"
                    rows="2"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="respuesta_uno" className="form-label">Opción 1 *</label>
                  <input
                    type="text"
                    id="respuesta_uno"
                    name="respuesta_uno"
                    value={formData.respuesta_uno}
                    onChange={handleChange}
                    placeholder="Primera opción"
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="respuesta_dos" className="form-label">Opción 2 *</label>
                  <input
                    type="text"
                    id="respuesta_dos"
                    name="respuesta_dos"
                    value={formData.respuesta_dos}
                    onChange={handleChange}
                    placeholder="Segunda opción"
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="respuesta_tres" className="form-label">Opción 3 *</label>
                  <input
                    type="text"
                    id="respuesta_tres"
                    name="respuesta_tres"
                    value={formData.respuesta_tres}
                    onChange={handleChange}
                    placeholder="Tercera opción"
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="respuesta_cuatro" className="form-label">Opción 4 *</label>
                  <input
                    type="text"
                    id="respuesta_cuatro"
                    name="respuesta_cuatro"
                    value={formData.respuesta_cuatro}
                    onChange={handleChange}
                    placeholder="Cuarta opción"
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="respuestaCorrecta" className="form-label">Respuesta Correcta *</label>
                  <select
                    id="respuestaCorrecta"
                    name="respuestaCorrecta"
                    value={formData.respuestaCorrecta}
                    onChange={handleChange}
                    className="form-control"
                    required
                  >
                    <option value="">Selecciona la respuesta correcta</option>
                    <option value={formData.respuesta_uno}>Opción 1</option>
                    <option value={formData.respuesta_dos}>Opción 2</option>
                    <option value={formData.respuesta_tres}>Opción 3</option>
                    <option value={formData.respuesta_cuatro}>Opción 4</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {modoEdicion ? 'Actualizar Reto' : 'Guardar Reto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Retos;
