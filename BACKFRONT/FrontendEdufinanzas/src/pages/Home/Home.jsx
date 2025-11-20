/**
 * Página de Inicio (Home)
 * Primera pantalla que ve el usuario al entrar a la aplicación
 * Muestra presentación de EduFinanzas, temas disponibles y tips periódicos
 * Los usuarios NO autenticados pueden ver esta página
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Alert } from 'react-bootstrap'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import TemaCard from '../../components/TemaCard/TemaCard'
import TipCard from '../../components/TipCard/TipCard'
import TipModal from '../../components/TipModal/TipModal'
import { obtenerTemas, obtenerTips } from '../../services/api'
import './Home.css'

const Home = () => {
  const navigate = useNavigate()

  // Estados para temas y tips
  const [temas, setTemas] = useState([])
  const [tips, setTips] = useState([])

  // Estados de carga y errores
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Estado para el modal de tips
  const [showTipModal, setShowTipModal] = useState(false)
  const [tipSeleccionado, setTipSeleccionado] = useState(null)

  /**
   * Efecto para cargar temas y tips al montar el componente
   */
  useEffect(() => {
    cargarDatos()
  }, [])

  /**
   * Función para cargar temas y tips desde el backend
   */
  const cargarDatos = async () => {
    try {
      setLoading(true)
      setError(null)

      // Hacer ambas peticiones en paralelo
      const [temasData, tipsData] = await Promise.all([
        obtenerTemas(),
        obtenerTips(),
      ])

      setTemas(temasData)
      setTips(tipsData)
    } catch (err) {
      console.error('Error al cargar datos:', err)
      setError('No se pudieron cargar los datos. Por favor, intenta más tarde.')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Maneja el click en una tarjeta de tema
   * Redirige a la página de login
   */
  const handleTemaClick = () => {
    navigate('/login')
  }

  /**
   * Maneja el click en una tarjeta de tip
   * Muestra el modal con la información completa del tip
   */
  const handleTipClick = (tip) => {
    setTipSeleccionado(tip)
    setShowTipModal(true)
  }

  /**
   * Cierra el modal de tips
   */
  const handleCloseTipModal = () => {
    setShowTipModal(false)
    setTipSeleccionado(null)
  }

  // Mostrar indicador de carga
  if (loading) {
    return (
      <div className="page-container">
        <Header tipo="public" />
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="page-container">
      <Header tipo="public" />

      <main className="page-content">
        <Container>
          {/* Mostrar error si existe */}
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* PRIMERA DIVISIÓN: Presentación y Temas */}
          <section className="home-section mb-5">
            {/* Presentación de EduFinanzas */}
            <div className="home-hero fade-in">
              <h1 className="home-title">Aprende a manejar el dinero como un pro</h1>
              <p className="home-description">
                EduFinanzas es tu plataforma de educación financiera diseñada para jóvenes.
                Aprende conceptos fundamentales de finanzas de forma divertida e interactiva.
                Completa retos, gana monedas virtuales y domina el arte de administrar tu dinero.
              </p>
            </div>

            {/* Temas disponibles */}
            <div className="temas-section mt-5">
              <h2 className="section-title">Explora nuestros temas</h2>
              <p className="section-subtitle mb-4">
                Haz click en cualquier tema para comenzar tu viaje en educación financiera
              </p>

              {temas.length === 0 ? (
                <Alert variant="info">
                  No hay temas disponibles en este momento.
                </Alert>
              ) : (
                <Row xs={1} md={2} lg={3} className="g-4">
                  {temas.map((tema) => (
                    <Col key={tema.id_tema}>
                      <TemaCard tema={tema} onClick={handleTemaClick} />
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          </section>

          {/* SEGUNDA DIVISIÓN: Tips Periódicos */}
          <section className="tips-section fade-in">
            <div className="tips-header">
              <h2 className="section-title">Recibe tips diarios</h2>
              <p className="section-subtitle mb-4">
                Consejos financieros rápidos y útiles para aplicar en tu día a día
              </p>
            </div>

            {tips.length === 0 ? (
              <Alert variant="info">
                No hay tips disponibles en este momento.
              </Alert>
            ) : (
              <Row xs={1} md={2} lg={3} className="g-4">
                {tips.map((tip) => (
                  <Col key={tip.id_recompensa}>
                    <TipCard tip={tip} onClick={() => handleTipClick(tip)} />
                  </Col>
                ))}
              </Row>
            )}
          </section>
        </Container>
      </main>

      <Footer />

      {/* Modal para mostrar el contenido completo de un tip */}
      <TipModal
        show={showTipModal}
        onHide={handleCloseTipModal}
        tip={tipSeleccionado}
      />
    </div>
  )
}

export default Home
