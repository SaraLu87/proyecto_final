/**
 * Pantalla de Retos
 * Muestra dos círculos: uno con información teórica y otro con preguntas
 */
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Card, Button, Form, Alert, Spinner } from 'react-bootstrap'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import { useAuth } from '../../context/AuthContext'
import { obtenerReto, solucionarReto, actualizarProgreso } from '../../services/api'
import './Retos.css'

const Retos = () => {
  const { idReto } = useParams()
  const navigate = useNavigate()
  const { obtenerIdPerfil, actualizarMonedas } = useAuth()

  // Estados
  const [reto, setReto] = useState(null)
  const [circuloActivo, setCirculoActivo] = useState(1) // 1 = Teoría, 2 = Preguntas
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState('')
  const [loading, setLoading] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)
  const [resultado, setResultado] = useState(null)

  useEffect(() => {
    cargarReto()
  }, [idReto])

  const cargarReto = async () => {
    try {
      setLoading(true)
      const retoData = await obtenerReto(idReto)
      setReto(retoData)
    } catch (err) {
      console.error('Error al cargar reto:', err)
      setError('No se pudo cargar el reto.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitRespuesta = async (e) => {
    e.preventDefault()

    if (!respuestaSeleccionada) {
      alert('Por favor selecciona una respuesta.')
      return
    }

    try {
      setEnviando(true)
      const idPerfil = obtenerIdPerfil()

      // Enviar respuesta al backend
      const result = await solucionarReto({
        id_perfil: idPerfil,
        id_reto: parseInt(idReto),
        respuesta_seleccionada: respuestaSeleccionada,
      })

      // Verificar si la respuesta fue correcta
      if (result.completado) {
        // Actualizar monedas en el contexto
        actualizarMonedas(reto.recompensa_monedas)
        setResultado({ correcto: true, mensaje: '¡Correcto! Ganaste ' + reto.recompensa_monedas + ' monedas.' })
      } else {
        setResultado({ correcto: false, mensaje: 'Respuesta incorrecta. Intenta nuevamente.' })
      }
    } catch (err) {
      console.error('Error al enviar respuesta:', err)
      setError('Error al enviar la respuesta.')
    } finally {
      setEnviando(false)
    }
  }

  const handleVolverATemas = () => {
    if (reto?.id_tema) {
      navigate(`/temas/${reto.id_tema}/retos`)
    } else {
      navigate('/temas')
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <Header />
        <Container className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Cargando reto...</p>
        </Container>
        <Footer />
      </div>
    )
  }

  if (!reto) {
    return (
      <div className="page-container">
        <Header />
        <Container className="py-5">
          <Alert variant="danger">Reto no encontrado</Alert>
          <Button onClick={() => navigate('/temas')}>Volver a Temas</Button>
        </Container>
        <Footer />
      </div>
    )
  }

  return (
    <div className="page-container">
      <Header />

      <Container className="retos-container py-4">
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Título del reto */}
        <h1 className="retos-title text-center mb-4">{reto.nombre_reto}</h1>

        {/* Navegación entre círculos */}
        <div className="circulos-nav mb-4">
          <Button
            variant={circuloActivo === 1 ? 'primary' : 'outline-primary'}
            onClick={() => setCirculoActivo(1)}
            className="me-2"
          >
            1. Teoría
          </Button>
          <Button
            variant={circuloActivo === 2 ? 'primary' : 'outline-primary'}
            onClick={() => setCirculoActivo(2)}
            disabled={!reto.descripcion}
          >
            2. Preguntas
          </Button>
        </div>

        {/* CÍRCULO 1: Teoría */}
        {circuloActivo === 1 && (
          <Card className="circulo-card teoria-card fade-in">
            <Card.Body>
              <Card.Title className="circulo-title">
                <i className="bi bi-book me-2"></i>
                Información Teórica
              </Card.Title>
              <Card.Text className="circulo-content">{reto.descripcion}</Card.Text>
              <div className="text-end mt-4">
                <Button variant="primary" onClick={() => setCirculoActivo(2)}>
                  Continuar a Preguntas <i className="bi bi-arrow-right ms-2"></i>
                </Button>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* CÍRCULO 2: Preguntas */}
        {circuloActivo === 2 && (
          <Card className="circulo-card preguntas-card fade-in">
            <Card.Body>
              <Card.Title className="circulo-title">
                <i className="bi bi-question-circle me-2"></i>
                Pregunta
              </Card.Title>
              <Card.Text className="pregunta-text mb-4">{reto.pregunta}</Card.Text>

              {resultado ? (
                <Alert variant={resultado.correcto ? 'success' : 'danger'}>
                  {resultado.mensaje}
                  {resultado.correcto && (
                    <div className="mt-3">
                      <Button variant="success" onClick={handleVolverATemas}>
                        Volver a Retos
                      </Button>
                    </div>
                  )}
                </Alert>
              ) : (
                <Form onSubmit={handleSubmitRespuesta}>
                  {/* Opciones de respuesta */}
                  <Form.Group className="mb-3">
                    {[reto.respuesta_uno, reto.respuesta_dos, reto.respuesta_tres, reto.respuesta_cuatro]
                      .filter(Boolean)
                      .map((opcion, index) => (
                        <Form.Check
                          key={index}
                          type="radio"
                          id={`opcion-${index}`}
                          label={opcion}
                          name="respuesta"
                          value={opcion}
                          onChange={(e) => setRespuestaSeleccionada(e.target.value)}
                          className="respuesta-opcion"
                        />
                      ))}
                  </Form.Group>

                  {/* Botones */}
                  <div className="d-flex justify-content-between">
                    <Button variant="outline-secondary" onClick={() => setCirculoActivo(1)}>
                      <i className="bi bi-arrow-left me-2"></i>
                      Volver a Teoría
                    </Button>
                    <Button type="submit" variant="primary" disabled={enviando}>
                      {enviando ? 'Enviando...' : 'Enviar Respuesta'}
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        )}

        {/* Botón para salir */}
        <div className="text-center mt-4">
          <Button variant="outline-danger" onClick={handleVolverATemas}>
            Salir del Reto
          </Button>
        </div>
      </Container>

      <Footer />
    </div>
  )
}

export default Retos
