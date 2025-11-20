/**
 * Página de Registro
 * Permite a nuevos usuarios crear una cuenta
 * Incluye validación de contraseña segura y verificación de correo único
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container, Form, Button, Alert, Card, Row, Col } from 'react-bootstrap'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import { register } from '../../services/api'
import './Register.css'

const Register = () => {
  const navigate = useNavigate()

  // Estados del formulario
  const [formData, setFormData] = useState({
    correo: '',
    contrasena: '',
    confirmarContrasena: '',
    nombre_perfil: '',
    edad: '',
  })

  // Estados de UI
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [mostrarContrasena, setMostrarContrasena] = useState(false)
  const [mostrarConfirmarContrasena, setMostrarConfirmarContrasena] = useState(false)

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
   * Valida que la contraseña sea segura
   * Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial
   */
  const validarContrasenaSegura = (contrasena) => {
    const requisitos = {
      longitud: contrasena.length >= 8,
      mayuscula: /[A-Z]/.test(contrasena),
      minuscula: /[a-z]/.test(contrasena),
      numero: /[0-9]/.test(contrasena),
      especial: /[!@#$%^&*(),.?":{}|<>]/.test(contrasena),
    }

    const cumpleTodos = Object.values(requisitos).every((req) => req === true)

    return { cumpleTodos, requisitos }
  }

  /**
   * Valida el formulario antes de enviar
   */
  const validarFormulario = () => {
    // Validar campos vacíos
    if (!formData.correo.trim()) {
      setError('Por favor ingresa tu correo electrónico')
      return false
    }

    if (!formData.contrasena) {
      setError('Por favor ingresa una contraseña')
      return false
    }

    if (!formData.confirmarContrasena) {
      setError('Por favor confirma tu contraseña')
      return false
    }

    if (!formData.nombre_perfil.trim()) {
      setError('Por favor ingresa tu nombre')
      return false
    }

    if (!formData.edad) {
      setError('Por favor ingresa tu edad')
      return false
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.correo)) {
      setError('Por favor ingresa un correo electrónico válido')
      return false
    }

    // Validar edad mínima
    const edad = parseInt(formData.edad)
    if (isNaN(edad) || edad < 14) {
      setError('Debes tener al menos 14 años para registrarte')
      return false
    }

    if (edad > 120) {
      setError('Por favor ingresa una edad válida')
      return false
    }

    // Validar contraseña segura
    const { cumpleTodos, requisitos } = validarContrasenaSegura(formData.contrasena)
    if (!cumpleTodos) {
      let mensajeError = 'La contraseña debe cumplir los siguientes requisitos:\n'
      if (!requisitos.longitud) mensajeError += '- Al menos 8 caracteres\n'
      if (!requisitos.mayuscula) mensajeError += '- Al menos una letra mayúscula\n'
      if (!requisitos.minuscula) mensajeError += '- Al menos una letra minúscula\n'
      if (!requisitos.numero) mensajeError += '- Al menos un número\n'
      if (!requisitos.especial) mensajeError += '- Al menos un carácter especial (!@#$%^&*)\n'
      setError(mensajeError)
      return false
    }

    // Validar que las contraseñas coincidan
    if (formData.contrasena !== formData.confirmarContrasena) {
      setError('Las contraseñas no coinciden')
      return false
    }

    return true
  }

  /**
   * Maneja el envío del formulario de registro
   */
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validar formulario
    if (!validarFormulario()) return

    try {
      setLoading(true)
      setError(null)

      // Preparar datos para enviar al backend
      const userData = {
        correo: formData.correo,
        contrasena: formData.contrasena,
        rol: 'Usuario', // Por defecto todos son usuarios
        perfil: {
          nombre_perfil: formData.nombre_perfil,
          edad: parseInt(formData.edad),
          monedas: 0, // Comenzar con 0 monedas
        },
      }

      // Llamar a la API de registro
      await register(userData)

      // Registro exitoso - redirigir al login
      navigate('/login', {
        state: {
          message: 'Cuenta creada exitosamente. Ahora puedes iniciar sesión.',
        },
      })
    } catch (err) {
      console.error('Error en registro:', err)

      // Manejar diferentes tipos de errores
      if (err.response?.status === 400) {
        const errorMsg = err.response.data?.detail || err.response.data?.correo?.[0]
        if (errorMsg?.includes('correo') || errorMsg?.includes('existe')) {
          setError('Este correo electrónico ya está registrado')
        } else {
          setError(errorMsg || 'Datos inválidos. Por favor, verifica los campos.')
        }
      } else {
        setError('Ocurrió un error al crear la cuenta. Por favor, intenta nuevamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <Header tipo="public" />

      <main className="page-content register-content">
        <Container>
          <div className="register-wrapper">
            <Card className="register-card fade-in">
              <Card.Body>
                <div className="text-center mb-4">
                  <h2 className="register-title">Crear Cuenta</h2>
                  <p className="text-muted">
                    Únete a EduFinanzas y comienza tu aprendizaje
                  </p>
                </div>

                {/* Mostrar error si existe */}
                {error && (
                  <Alert
                    variant="danger"
                    dismissible
                    onClose={() => setError(null)}
                    style={{ whiteSpace: 'pre-line' }}
                  >
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    {/* Campo de Nombre */}
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="nombre_perfil">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                          type="text"
                          name="nombre_perfil"
                          placeholder="Tu nombre"
                          value={formData.nombre_perfil}
                          onChange={handleChange}
                          disabled={loading}
                          required
                        />
                      </Form.Group>
                    </Col>

                    {/* Campo de Edad */}
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="edad">
                        <Form.Label>Edad</Form.Label>
                        <Form.Control
                          type="number"
                          name="edad"
                          placeholder="Tu edad"
                          min="14"
                          max="120"
                          value={formData.edad}
                          onChange={handleChange}
                          disabled={loading}
                          required
                        />
                        <Form.Text className="text-muted">
                          Debes tener al menos 14 años
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>

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
                        placeholder="Crea una contraseña segura"
                        value={formData.contrasena}
                        onChange={handleChange}
                        disabled={loading}
                        autoComplete="new-password"
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
                    <Form.Text className="text-muted">
                      Mínimo 8 caracteres, incluye mayúsculas, minúsculas, números y
                      caracteres especiales
                    </Form.Text>
                  </Form.Group>

                  {/* Campo de Confirmar Contraseña */}
                  <Form.Group className="mb-3" controlId="confirmarContrasena">
                    <Form.Label>Confirmar Contraseña</Form.Label>
                    <div className="password-input-wrapper">
                      <Form.Control
                        type={mostrarConfirmarContrasena ? 'text' : 'password'}
                        name="confirmarContrasena"
                        placeholder="Confirma tu contraseña"
                        value={formData.confirmarContrasena}
                        onChange={handleChange}
                        disabled={loading}
                        autoComplete="new-password"
                        required
                      />
                      <Button
                        variant="link"
                        className="toggle-password"
                        onClick={() =>
                          setMostrarConfirmarContrasena(!mostrarConfirmarContrasena)
                        }
                        type="button"
                        tabIndex={-1}
                      >
                        {mostrarConfirmarContrasena ? '👁️' : '👁️‍🗨️'}
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
                        Creando cuenta...
                      </>
                    ) : (
                      'Crear Cuenta'
                    )}
                  </Button>

                  {/* Enlaces adicionales */}
                  <div className="text-center">
                    <p className="mb-2">
                      ¿Ya tienes cuenta?{' '}
                      <Link to="/login" className="fw-semibold">
                        Iniciar sesión
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

export default Register
