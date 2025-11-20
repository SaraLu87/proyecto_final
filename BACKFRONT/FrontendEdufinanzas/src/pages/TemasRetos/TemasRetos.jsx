/**
 * Pantalla TemasRetos
 * Muestra información del tema seleccionado y la lista de retos disponibles
 * El primer reto siempre es gratis (costo 0 monedas)
 */
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner } from 'react-bootstrap'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import { useAuth } from '../../context/AuthContext'
import {
  obtenerTema,
  obtenerRetos,
  obtenerProgresoPerfil,
  crearProgreso,
  getImageUrl,
} from '../../services/api'
import './TemasRetos.css'

const TemasRetos = () => {
  const { idTema } = useParams()
  const navigate = useNavigate()
  const { obtenerIdPerfil, obtenerMonedas, actualizarMonedas } = useAuth()

  // Estados
  const [tema, setTema] = useState(null)
  const [retos, setRetos] = useState([])
  const [progreso, setProgreso] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    cargarDatos()
  }, [idTema])

  const cargarDatos = async () => {
    try {
      setLoading(true)
      setError(null)

      const idPerfil = obtenerIdPerfil()

      // Cargar tema, retos y progreso del usuario
      const [temaData, todosRetos, progresoData] = await Promise.all([
        obtenerTema(idTema),
        obtenerRetos(),
        obtenerProgresoPerfil(idPerfil),
      ])

      // Filtrar solo los retos de este tema
      const retosTema = todosRetos.filter((reto) => reto.id_tema === parseInt(idTema))

      setTema(temaData)
      setRetos(retosTema)
      setProgreso(progresoData)
    } catch (err) {
      console.error('Error al cargar datos:', err)
      setError('No se pudieron cargar los datos del tema.')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Verifica si un reto está disponible para jugar
   */
  const esRetoDisponible = (reto, indexReto) => {
    // El primer reto siempre está disponible
    if (indexReto === 0) return true

    // Verificar si el reto anterior fue completado
    const retoAnterior = retos[indexReto - 1]
    const progresoAnterior = progreso.find(
      (p) => p.id_reto === retoAnterior.id_reto && p.completado
    )

    return !!progresoAnterior
  }

  /**
   * Verifica si un reto ya fue completado
   */
  const esRetoCompletado = (retoId) => {
    return progreso.some((p) => p.id_reto === retoId && p.completado)
  }

  /**
   * Maneja el click en un reto
   */
  const handleRetoClick = async (reto, indexReto) => {
    const monedasActuales = obtenerMonedas()
    const disponible = esRetoDisponible(reto, indexReto)
    const completado = esRetoCompletado(reto.id_reto)

    if (!disponible) {
      alert('Debes completar el reto anterior para desbloquear este.')
      return
    }

    if (completado) {
      alert('Ya completaste este reto.')
      return
    }

    // Verificar si tiene suficientes monedas
    if (monedasActuales < reto.costo_monedas) {
      alert(`Necesitas ${reto.costo_monedas} monedas para jugar este reto. Tienes ${monedasActuales}.`)
      return
    }

    try {
      // Crear registro de progreso (el trigger del backend restará las monedas automáticamente)
      const idPerfil = obtenerIdPerfil()
      await crearProgreso({
        id_perfil: idPerfil,
        id_reto: reto.id_reto,
        completado: false,
        fecha_completado: null,
        respuesta_seleccionada: null,
      })

      // Actualizar monedas en el contexto
      actualizarMonedas(-reto.costo_monedas)

      // Navegar a la pantalla del reto
      navigate(`/retos/${reto.id_reto}`)
    } catch (err) {
      console.error('Error al iniciar reto:', err)
      alert('Error al iniciar el reto. Por favor, intenta nuevamente.')
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <Header />
        <Container className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Cargando...</p>
        </Container>
        <Footer />
      </div>
    )
  }

  if (!tema) {
    return (
      <div className="page-container">
        <Header />
        <Container className="py-5">
          <Alert variant="danger">Tema no encontrado</Alert>
          <Button onClick={() => navigate('/temas')}>Volver a Temas</Button>
        </Container>
        <Footer />
      </div>
    )
  }

  return (
    <div className="page-container">
      <Header />

      <Container className="temas-retos-container py-4">
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* PRIMER MÓDULO: Información del Tema */}
        <Card className="tema-info-card mb-4 fade-in">
          <Row className="g-0">
            <Col md={4}>
              {tema.img_tema && (
                <Card.Img
                  src={getImageUrl(tema.img_tema)}
                  alt={tema.nombre}
                  className="tema-info-img"
                />
              )}
            </Col>
            <Col md={8}>
              <Card.Body>
                <Card.Title as="h1" className="tema-info-title">
                  {tema.nombre}
                </Card.Title>
                <Card.Subtitle className="mb-3 text-muted">{tema.descripcion}</Card.Subtitle>
                <Card.Text className="tema-info-content">{tema.informacion_tema}</Card.Text>
              </Card.Body>
            </Col>
          </Row>
        </Card>

        {/* SEGUNDO MÓDULO: Lista de Retos */}
        <div className="retos-section">
          <h2 className="retos-section-title mb-4">Retos del Tema</h2>

          {retos.length === 0 ? (
            <Alert variant="info">No hay retos disponibles para este tema.</Alert>
          ) : (
            <Row xs={1} md={2} lg={3} className="g-4">
              {retos.map((reto, index) => {
                const disponible = esRetoDisponible(reto, index)
                const completado = esRetoCompletado(reto.id_reto)

                return (
                  <Col key={reto.id_reto}>
                    <Card
                      className={`reto-card ${disponible ? 'disponible' : 'bloqueado'} ${
                        completado ? 'completado' : ''
                      }`}
                      onClick={() => disponible && !completado && handleRetoClick(reto, index)}
                    >
                      {/* Imagen del reto */}
                      <div className="reto-card-img-container">
                        {reto.img_reto && (
                          <Card.Img
                            variant="top"
                            src={getImageUrl(reto.img_reto)}
                            alt={reto.nombre_reto}
                            className="reto-card-img"
                          />
                        )}
                        {!disponible && (
                          <div className="reto-bloqueado-overlay">
                            <i className="bi bi-lock-fill"></i>
                          </div>
                        )}
                        {completado && (
                          <div className="reto-completado-badge">
                            <i className="bi bi-check-circle-fill"></i>
                          </div>
                        )}
                      </div>

                      <Card.Body>
                        <Card.Title className="reto-card-title">{reto.nombre_reto}</Card.Title>
                        <Card.Text className="reto-card-description">
                          {reto.descripcion}
                        </Card.Text>

                        {/* Info del reto */}
                        <div className="reto-card-footer">
                          <div className="reto-costo">
                            <i className="bi bi-coin me-1"></i>
                            {reto.costo_monedas === 0 ? 'GRATIS' : `${reto.costo_monedas} monedas`}
                          </div>
                          <div className="reto-recompensa">
                            <i className="bi bi-trophy-fill me-1"></i>
                            +{reto.recompensa_monedas}
                          </div>
                        </div>

                        {/* Botón de acción */}
                        {completado ? (
                          <Badge bg="success" className="w-100 mt-2 p-2">
                            Completado
                          </Badge>
                        ) : disponible ? (
                          <Button variant="primary" className="w-100 mt-2">
                            Jugar Reto
                          </Button>
                        ) : (
                          <Button variant="secondary" disabled className="w-100 mt-2">
                            Bloqueado
                          </Button>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                )
              })}
            </Row>
          )}
        </div>

        {/* Botón para volver */}
        <div className="text-center mt-4">
          <Button variant="outline-primary" onClick={() => navigate('/temas')}>
            <i className="bi bi-arrow-left me-2"></i>
            Volver a Temas
          </Button>
        </div>
      </Container>

      <Footer />
    </div>
  )
}

export default TemasRetos
