/**
 * Página de Login
 * Permite a los usuarios iniciar sesión en la aplicación
 * Incluye validación de formulario y manejo de autenticación JWT
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container, Form, Button, Alert, Card } from 'react-bootstrap'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import { useAuth } from '../../context/AuthContext'
import './Login.css'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  // Estados del formulario
  const [formData, setFormData] = useState({
    correo: '',
    contrasena: '',
  })

  // Estados de UI
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [mostrarContrasena, setMostrarContrasena] = useState(false)

  /**
   * Maneja el cambio en los campos del formulario
   */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Limpiar error al escribir
    if (error) setError(null)
  }

  /**
   * Valida el formulario antes de enviar
   */
  const validarFormulario = () => {
    if (!formData.correo.trim()) {
      setError('Por favor ingresa tu correo electrónico')
      return false
    }

    if (!formData.contrasena) {
      setError('Por favor ingresa tu contraseña')
      return false
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.correo)) {
      setError('Por favor ingresa un correo electrónico válido')
      return false
    }

    return true
  }

  /**
   * Maneja el envío del formulario de login
   */
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validar formulario
    if (!validarFormulario()) return

    try {
      setLoading(true)
      setError(null)

      // Llamar a la función de login del contexto
      const resultado = await login(formData.correo, formData.contrasena)

      if (resultado.success) {
        // Login exitoso - redirigir según el rol del usuario
        const esAdmin = resultado.data.rol === 'Administrador'
        if (esAdmin) {
          navigate('/admin')
        } else {
          navigate('/temas')
        }
      } else {
        // Mostrar error del backend
        setError(resultado.error)
      }
    } catch (err) {
      console.error('Error en login:', err)
      setError('Ocurrió un error inesperado. Por favor, intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <Header tipo="public" />

      <main className="page-content login-content">
        <Container>
          <div className="login-wrapper">
            <Card className="login-card fade-in">
              <Card.Body>
                <div className="text-center mb-4">
                  <h2 className="login-title">Iniciar Sesión</h2>
                  <p className="text-muted">
                    Ingresa a tu cuenta de EduFinanzas
                  </p>
                </div>

                {/* Mostrar error si existe */}
                {error && (
                  <Alert variant="danger" dismissible onClose={() => setError(null)}>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  {/* Campo de Correo Electrónico */}
                  <Form.Group className="mb-3" controlId="correo">
                    <Form.Label>Correo Electrónico</Form.Label>
                    <Form.Control
                      type="email"
                      name="correo"
                      placeholder="ejemplo@correo.com"
                      value={formData.correo}
                      onChange={handleChange}
                      disabled={loading}
                      autoComplete="email"
                      required
                    />
                  </Form.Group>

                  {/* Campo de Contraseña */}
                  <Form.Group className="mb-3" controlId="contrasena">
                    <Form.Label>Contraseña</Form.Label>
                    <div className="password-input-wrapper">
                      <Form.Control
                        type={mostrarContrasena ? 'text' : 'password'}
                        name="contrasena"
                        placeholder="Ingresa tu contraseña"
                        value={formData.contrasena}
                        onChange={handleChange}
                        disabled={loading}
                        autoComplete="current-password"
                        required
                      />
                      <Button
                        variant="link"
                        className="toggle-password"
                        onClick={() => setMostrarContrasena(!mostrarContrasena)}
                        type="button"
                        tabIndex={-1}
                      >
                        {mostrarContrasena ? '👁️' : '👁️‍🗨️'}
                      </Button>
                    </div>
                  </Form.Group>

                  {/* Botón de envío */}
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 btn-gradient mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Iniciando sesión...
                      </>
                    ) : (
                      'Iniciar Sesión'
                    )}
                  </Button>

                  {/* Enlaces adicionales */}
                  <div className="text-center">
                    <p className="mb-2">
                      ¿No tienes cuenta?{' '}
                      <Link to="/registro" className="fw-semibold">
                        Crear cuenta
                      </Link>
                    </p>
                    <Link to="/" className="text-muted">
                      Volver a inicio
                    </Link>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  )
}

export default Login
