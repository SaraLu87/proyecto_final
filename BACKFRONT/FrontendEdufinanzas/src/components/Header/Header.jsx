/**
 * Componente Header Reutilizable
 * Muestra el encabezado de la aplicación
 * Adapta su contenido según el tipo de vista (pública, autenticada, admin)
 */
import { Link, useNavigate } from 'react-router-dom'
import { Navbar, Container, Nav, Button } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import './Header.css'

/**
 * @param {string} tipo - Tipo de header: 'public', 'user', 'admin'
 * public: Solo muestra el logo y el botón de "Iniciar Sesión"
 * user: Muestra logo, monedas, "Mi Perfil" y "Cerrar Sesión"
 * admin: Muestra logo, nombre del perfil y "Cerrar Sesión"
 */
const Header = ({ tipo = 'public' }) => {
  const navigate = useNavigate()
  const { usuario, logout, obtenerMonedas, obtenerNombrePerfil } = useAuth()

  /**
   * Maneja el cierre de sesión
   */
  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  /**
   * Maneja el click en el logo
   * Redirige a la página de inicio
   */
  const handleLogoClick = () => {
    navigate('/')
  }

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="header-navbar">
      <Container fluid>
        {/* Logo - Clickeable para ir a inicio */}
        <Navbar.Brand
          onClick={handleLogoClick}
          style={{ cursor: 'pointer' }}
          className="d-flex align-items-center"
        >
          {/*
            IMPORTANTE: Colocar aquí la imagen del logo
            Ruta de la imagen: /public/assets/logo.png
            O utilizar una imagen del backend si es necesario
          */}
          <img
            src="/assets/logo.png"
            alt="EduFinanzas Logo"
            height="40"
            className="d-inline-block align-top me-2"
            onError={(e) => {
              // Si la imagen no carga, mostrar texto
              e.target.style.display = 'none'
            }}
          />
          <span className="fw-bold">EduFinanzas</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {/* Header Público - Solo botón de Iniciar Sesión */}
            {tipo === 'public' && (
              <Link to="/login" className="text-decoration-none">
                <Button variant="light" size="sm">
                  Iniciar Sesión
                </Button>
              </Link>
            )}

            {/* Header de Usuario - Monedas, Mi Perfil y Cerrar Sesión */}
            {tipo === 'user' && (
              <>
                {/* Mostrar monedas */}
                <div className="monedas-display me-3">
                  <span className="monedas-icono">💰</span>
                  <span className="monedas-cantidad fw-bold">{obtenerMonedas()}</span>
                </div>

                {/* Botón Mi Perfil */}
                <Link to="/perfil" className="text-decoration-none me-2">
                  <Button variant="outline-light" size="sm">
                    Mi Perfil
                  </Button>
                </Link>

                {/* Botón Cerrar Sesión */}
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  Cerrar Sesión
                </Button>
              </>
            )}

            {/* Header de Administrador - Nombre del perfil y Cerrar Sesión */}
            {tipo === 'admin' && (
              <>
                {/* Nombre del perfil */}
                <span className="text-light me-3">
                  <strong>{obtenerNombrePerfil()}</strong>
                </span>

                {/* Botón Cerrar Sesión */}
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  Cerrar Sesión
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header
