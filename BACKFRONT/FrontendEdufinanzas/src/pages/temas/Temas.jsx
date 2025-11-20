/**
 * Pantalla de Temas
 * Muestra todos los temas disponibles con su progreso
 * Los temas se van desbloqueando conforme el usuario avanza en los retos
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, ProgressBar as BSProgressBar, Alert, Spinner } from 'react-bootstrap'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import { useAuth } from '../../context/AuthContext'
import { obtenerTemas, obtenerProgresoPerfil, obtenerRetos, getImageUrl } from '../../services/api'
import './Temas.css'

const Temas = () => {
  const navigate = useNavigate()
  const { obtenerIdPerfil, obtenerMonedas } = useAuth()

  // Estados
  const [temas, setTemas] = useState([])
  const [progreso, setProgreso] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /**
   * Efecto para cargar temas y progreso al montar el componente
   */
  useEffect(() => {
    cargarDatos()
  }, [])

  /**
   * Función para cargar temas, retos y progreso del usuario
   */
  const cargarDatos = async () => {
    try {
      setLoading(true)
      setError(null)

      const idPerfil = obtenerIdPerfil()

      // Cargar temas, retos y progreso en paralelo
      const [temasData, retosData, progresoData] = await Promise.all([
        obtenerTemas(),
        obtenerRetos(),
        obtenerProgresoPerfil(idPerfil),
      ])

      // Calcular progreso por tema
      const progresoPorTema = calcularProgresoPorTema(temasData, retosData, progresoData)

      setTemas(temasData)
      setProgreso(progresoPorTema)
    } catch (err) {
      console.error('Error al cargar datos:', err)
      setError('No se pudieron cargar los temas. Por favor, intenta más tarde.')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Calcula el progreso de cada tema
   * @param {Array} temas - Lista de todos los temas
   * @param {Array} retos - Lista de todos los retos
   * @param {Array} progreso - Progreso del usuario
   * @returns {Object} Objeto con el progreso por tema
   */
  const calcularProgresoPorTema = (temas, retos, progreso) => {
    const resultado = {}

    temas.forEach((tema) => {
      // Filtrar retos que pertenecen a este tema
      const retosTema = retos.filter((reto) => reto.id_tema === tema.id_tema)

      // Filtrar retos completados del tema
      const retosCompletados = progreso.filter(
        (prog) =>
          prog.completado &&
          retosTema.some((reto) => reto.id_reto === prog.id_reto)
      )

      // Calcular porcentaje de completitud
      const totalRetos = retosTema.length
      const retosCompletos = retosCompletados.length
      const porcentaje = totalRetos > 0 ? (retosCompletos / totalRetos) * 100 : 0

      // Determinar si el tema está desbloqueado
      // El primer tema siempre está desbloqueado
      // Los demás se desbloquean al completar al menos el 80% del tema anterior
      const esDesbloqueado = determinarSiEstaDesbloqueado(tema, temas, resultado)

      resultado[tema.id_tema] = {
        totalRetos,
        retosCompletos,
        porcentaje: Math.round(porcentaje),
        desbloqueado: esDesbloqueado,
      }
    })

    return resultado
  }

  /**
   * Determina si un tema está desbloqueado
   * @param {Object} tema - Tema a evaluar
   * @param {Array} todosTemas - Lista de todos los temas
   * @param {Object} progresoCalculado - Progreso calculado hasta ahora
   * @returns {boolean} True si está desbloqueado
   */
  const determinarSiEstaDesbloqueado = (tema, todosTemas, progresoCalculado) => {
    // El primer tema siempre está desbloqueado
    if (tema.id_tema === todosTemas[0]?.id_tema) {
      return true
    }

    // Encontrar el índice del tema actual
    const indiceActual = todosTemas.findIndex((t) => t.id_tema === tema.id_tema)

    if (indiceActual <= 0) return false

    // Obtener el tema anterior
    const temaAnterior = todosTemas[indiceActual - 1]

    // Verificar si el tema anterior tiene al menos 80% de completitud
    const progresoAnterior = progresoCalculado[temaAnterior.id_tema]

    return progresoAnterior && progresoAnterior.porcentaje >= 80
  }

  /**
   * Maneja el click en una tarjeta de tema
   * @param {Object} tema - Tema seleccionado
   */
  const handleTemaClick = (tema) => {
    const progresoTema = progreso[tema.id_tema]

    if (!progresoTema?.desbloqueado) {
      // Tema bloqueado, mostrar mensaje
      alert('Este tema aún está bloqueado. Completa el tema anterior para desbloquearlo.')
      return
    }

    // Navegar a la pantalla de retos del tema
    navigate(`/temas/${tema.id_tema}/retos`)
  }

  // Mostrar loading
  if (loading) {
    return (
      <div className="page-container">
        <Header />
        <Container className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Cargando temas...</p>
        </Container>
        <Footer />
      </div>
    )
  }

  return (
    <div className="page-container">
      <Header />

      <Container className="temas-container py-4">
        {/* Título de la página */}
        <div className="text-center mb-4">
          <h1 className="temas-title">Temas de Educación Financiera</h1>
          <p className="temas-subtitle">
            Selecciona un tema para comenzar tus retos. Completa al menos el 80% de cada tema para
            desbloquear el siguiente.
          </p>
        </div>

        {/* Mostrar error si existe */}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Grid de temas */}
        <Row xs={1} md={2} lg={3} className="g-4">
          {temas.map((tema) => {
            const progresoTema = progreso[tema.id_tema] || {
              porcentaje: 0,
              retosCompletos: 0,
              totalRetos: 0,
              desbloqueado: false,
            }

            return (
              <Col key={tema.id_tema}>
                <Card
                  className={`tema-card ${
                    progresoTema.desbloqueado ? 'desbloqueado' : 'bloqueado'
                  } ${progresoTema.porcentaje === 100 ? 'completado' : ''}`}
                  onClick={() => handleTemaClick(tema)}
                >
                  {/* Imagen del tema */}
                  <div className="tema-card-img-container">
                    {tema.img_tema && (
                      <Card.Img
                        variant="top"
                        src={getImageUrl(tema.img_tema)}
                        alt={tema.nombre}
                        className="tema-card-img"
                      />
                    )}
                    {/* Overlay para temas bloqueados */}
                    {!progresoTema.desbloqueado && (
                      <div className="tema-bloqueado-overlay">
                        <i className="bi bi-lock-fill"></i>
                        <span>Bloqueado</span>
                      </div>
                    )}
                    {/* Badge para temas completados */}
                    {progresoTema.porcentaje === 100 && (
                      <div className="tema-completado-badge">
                        <i className="bi bi-check-circle-fill"></i>
                        <span>Completado</span>
                      </div>
                    )}
                  </div>

                  <Card.Body>
                    {/* Nombre del tema */}
                    <Card.Title className="tema-card-title">{tema.nombre}</Card.Title>

                    {/* Descripción del tema */}
                    <Card.Text className="tema-card-description">{tema.descripcion}</Card.Text>

                    {/* Barra de progreso */}
                    <div className="tema-progreso-container">
                      <div className="tema-progreso-info">
                        <span className="tema-progreso-text">
                          {progresoTema.retosCompletos} de {progresoTema.totalRetos} retos
                        </span>
                        <span className="tema-progreso-porcentaje">
                          {progresoTema.porcentaje}%
                        </span>
                      </div>
                      <BSProgressBar
                        now={progresoTema.porcentaje}
                        variant={
                          progresoTema.porcentaje === 100
                            ? 'success'
                            : progresoTema.porcentaje >= 50
                            ? 'primary'
                            : 'warning'
                        }
                        className="tema-progreso-bar"
                      />
                    </div>

                    {/* Información adicional */}
                    <div className="tema-card-footer">
                      {progresoTema.desbloqueado ? (
                        <span className="tema-estado desbloqueado">
                          <i className="bi bi-unlock-fill me-1"></i>
                          Disponible
                        </span>
                      ) : (
                        <span className="tema-estado bloqueado">
                          <i className="bi bi-lock-fill me-1"></i>
                          Bloqueado
                        </span>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            )
          })}
        </Row>

        {/* Mensaje si no hay temas */}
        {temas.length === 0 && !loading && (
          <Alert variant="info" className="text-center mt-4">
            No hay temas disponibles en este momento.
          </Alert>
        )}
      </Container>

      <Footer />
    </div>
  )
}

export default Temas
