/**
 * Pantalla de Perfil de Usuario
 * Permite al usuario ver y actualizar su información personal
 */
import { useState, useEffect } from 'react'
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import { useAuth } from '../../context/AuthContext'
import { actualizarPerfil, obtenerPerfil, actualizarUsuario, getImageUrl } from '../../services/api'
import './PerfilUsuario.css'

const PerfilUsuario = () => {
  const { usuario, obtenerIdPerfil, obtenerIdUsuario, actualizarUsuario: actualizarContexto } = useAuth()

  // Estados del formulario
  const [nombrePerfil, setNombrePerfil] = useState('')
  const [edad, setEdad] = useState('')
  const [correo, setCorreo] = useState('')
  const [fotoPerfil, setFotoPerfil] = useState(null)
  const [fotoPreview, setFotoPreview] = useState(null)

  // Estados de control
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (usuario) {
      setNombrePerfil(usuario.perfil?.nombre_perfil || '')
      setEdad(usuario.perfil?.edad || '')
      setCorreo(usuario.correo || '')
      if (usuario.perfil?.foto_perfil) {
        setFotoPreview(getImageUrl(usuario.perfil.foto_perfil))
      }
    }
  }, [usuario])

  const handleFotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFotoPerfil(file)
      // Crear preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setFotoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMensaje(null)

    try {
      const idPerfil = obtenerIdPerfil()
      const idUsuario = obtenerIdUsuario()

      // Actualizar perfil
      const perfilData = new FormData()
      perfilData.append('nombre_perfil', nombrePerfil)
      perfilData.append('edad', edad)
      if (fotoPerfil) {
        perfilData.append('foto_perfil', fotoPerfil)
      }

      await actualizarPerfil(idPerfil, perfilData)

      // Actualizar usuario (correo)
      if (correo !== usuario.correo) {
        await actualizarUsuario(idUsuario, {
          correo,
          contrasena: usuario.contrasena, // Mantener la misma contraseña
          rol: usuario.rol,
        })
      }

      // Actualizar contexto
      actualizarContexto({
        correo,
        perfil: {
          ...usuario.perfil,
          nombre_perfil: nombrePerfil,
          edad: parseInt(edad),
        },
      })

      setMensaje('Perfil actualizado exitosamente.')
    } catch (err) {
      console.error('Error al actualizar perfil:', err)
      setError('No se pudo actualizar el perfil. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <Header />

      <Container className="perfil-container py-4">
        <h1 className="perfil-title text-center mb-4">Mi Perfil</h1>

        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="perfil-card">
              <Card.Body>
                {/* Mensajes */}
                {mensaje && <Alert variant="success">{mensaje}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

                {/* Preview de foto */}
                <div className="text-center mb-4">
                  <div className="foto-preview-container">
                    {fotoPreview ? (
                      <img src={fotoPreview} alt="Foto de perfil" className="foto-preview" />
                    ) : (
                      <div className="foto-placeholder">
                        <i className="bi bi-person-circle"></i>
                      </div>
                    )}
                  </div>
                </div>

                {/* Formulario */}
                <Form onSubmit={handleSubmit}>
                  {/* Nombre del perfil */}
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre del Perfil</Form.Label>
                    <Form.Control
                      type="text"
                      value={nombrePerfil}
                      onChange={(e) => setNombrePerfil(e.target.value)}
                      required
                      placeholder="Ingresa tu nombre"
                    />
                  </Form.Group>

                  {/* Edad */}
                  <Form.Group className="mb-3">
                    <Form.Label>Edad</Form.Label>
                    <Form.Control
                      type="number"
                      value={edad}
                      onChange={(e) => setEdad(e.target.value)}
                      required
                      min="14"
                      max="100"
                      placeholder="Ingresa tu edad"
                    />
                  </Form.Group>

                  {/* Correo electrónico */}
                  <Form.Group className="mb-3">
                    <Form.Label>Correo Electrónico</Form.Label>
                    <Form.Control
                      type="email"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      required
                      placeholder="correo@ejemplo.com"
                    />
                  </Form.Group>

                  {/* Foto de perfil */}
                  <Form.Group className="mb-4">
                    <Form.Label>Foto de Perfil</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleFotoChange}
                    />
                    <Form.Text className="text-muted">
                      Formatos aceptados: JPG, PNG, GIF (máx. 5MB)
                    </Form.Text>
                  </Form.Group>

                  {/* Información de monedas */}
                  <Card className="monedas-info-card mb-4">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="mb-0">Monedas Acumuladas</h5>
                          <small className="text-muted">Total de monedas ganadas</small>
                        </div>
                        <div className="monedas-badge">
                          <i className="bi bi-coin me-2"></i>
                          {usuario?.perfil?.monedas || 0}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>

                  {/* Botones */}
                  <div className="d-grid gap-2">
                    <Button type="submit" variant="primary" disabled={loading}>
                      {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Footer />
    </div>
  )
}

export default PerfilUsuario
