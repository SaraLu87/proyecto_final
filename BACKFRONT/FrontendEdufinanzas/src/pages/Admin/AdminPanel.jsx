/**
 * Panel de Administrador
 * CRUD completo para gestión de Temas, Retos, Tips y Usuarios
 * Solo accesible para usuarios con rol de Administrador
 */
import { useState } from 'react'
import { Container, Nav, Tab, Row, Col, Button } from 'react-bootstrap'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import { useAuth } from '../../context/AuthContext'
import './AdminPanel.css'

// TODO: Importar componentes CRUD individuales cuando se creen
// import CRUDTemas from './components/CRUDTemas'
// import CRUDRetos from './components/CRUDRetos'
// import CRUDTips from './components/CRUDTips'
// import CRUDUsuarios from './components/CRUDUsuarios'

const AdminPanel = () => {
  const { obtenerNombrePerfil, logout } = useAuth()
  const [tabActiva, setTabActiva] = useState('temas')

  return (
    <div className="page-container">
      {/* Header modificado para admin (sin monedas, con nombre y cerrar sesión) */}
      <div className="admin-header">
        <Container className="d-flex justify-content-between align-items-center py-3">
          <h2 className="mb-0">
            <i className="bi bi-speedometer2 me-2"></i>
            Panel de Administración
          </h2>
          <div className="d-flex align-items-center gap-3">
            <span className="admin-name">
              <i className="bi bi-person-circle me-2"></i>
              {obtenerNombrePerfil()}
            </span>
            <Button variant="outline-light" size="sm" onClick={logout}>
              <i className="bi bi-box-arrow-right me-2"></i>
              Cerrar Sesión
            </Button>
          </div>
        </Container>
      </div>

      <Container fluid className="admin-container py-4">
        <Tab.Container activeKey={tabActiva} onSelect={(k) => setTabActiva(k)}>
          <Row>
            {/* Sidebar con navegación */}
            <Col md={3} lg={2} className="sidebar-col">
              <Nav variant="pills" className="flex-column admin-sidebar">
                <Nav.Item>
                  <Nav.Link eventKey="temas">
                    <i className="bi bi-book me-2"></i>
                    Temas
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="retos">
                    <i className="bi bi-trophy me-2"></i>
                    Retos
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="tips">
                    <i className="bi bi-lightbulb me-2"></i>
                    Tips Periódicos
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="usuarios">
                    <i className="bi bi-people me-2"></i>
                    Usuarios
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>

            {/* Contenido principal */}
            <Col md={9} lg={10}>
              <Tab.Content>
                {/* Tab de Temas */}
                <Tab.Pane eventKey="temas">
                  <div className="admin-content-header">
                    <h3>Gestión de Temas</h3>
                    <p className="text-muted">Administra los temas de educación financiera</p>
                  </div>
                  <div className="admin-content-body">
                    {/* TODO: Implementar componente CRUDTemas */}
                    <div className="placeholder-content">
                      <i className="bi bi-book display-1 text-muted"></i>
                      <h4 className="mt-3">CRUD de Temas</h4>
                      <p className="text-muted">
                        Aquí podrás crear, ver, actualizar y eliminar temas.
                        <br />
                        Incluye subida de imágenes con Pillow.
                      </p>
                      <Button variant="primary">
                        <i className="bi bi-plus-circle me-2"></i>
                        Crear Nuevo Tema
                      </Button>
                    </div>
                    {/* <CRUDTemas /> */}
                  </div>
                </Tab.Pane>

                {/* Tab de Retos */}
                <Tab.Pane eventKey="retos">
                  <div className="admin-content-header">
                    <h3>Gestión de Retos</h3>
                    <p className="text-muted">
                      Administra los retos y preguntas de cada tema
                    </p>
                  </div>
                  <div className="admin-content-body">
                    {/* TODO: Implementar componente CRUDRetos */}
                    <div className="placeholder-content">
                      <i className="bi bi-trophy display-1 text-muted"></i>
                      <h4 className="mt-3">CRUD de Retos</h4>
                      <p className="text-muted">
                        Aquí podrás crear retos con sus preguntas y respuestas.
                        <br />
                        Incluye configuración de monedas y dificultad.
                      </p>
                      <Button variant="primary">
                        <i className="bi bi-plus-circle me-2"></i>
                        Crear Nuevo Reto
                      </Button>
                    </div>
                    {/* <CRUDRetos /> */}
                  </div>
                </Tab.Pane>

                {/* Tab de Tips */}
                <Tab.Pane eventKey="tips">
                  <div className="admin-content-header">
                    <h3>Gestión de Tips Periódicos</h3>
                    <p className="text-muted">Administra los tips diarios para los usuarios</p>
                  </div>
                  <div className="admin-content-body">
                    {/* TODO: Implementar componente CRUDTips */}
                    <div className="placeholder-content">
                      <i className="bi bi-lightbulb display-1 text-muted"></i>
                      <h4 className="mt-3">CRUD de Tips</h4>
                      <p className="text-muted">
                        Aquí podrás crear, ver, actualizar y eliminar tips periódicos.
                      </p>
                      <Button variant="primary">
                        <i className="bi bi-plus-circle me-2"></i>
                        Crear Nuevo Tip
                      </Button>
                    </div>
                    {/* <CRUDTips /> */}
                  </div>
                </Tab.Pane>

                {/* Tab de Usuarios */}
                <Tab.Pane eventKey="usuarios">
                  <div className="admin-content-header">
                    <h3>Gestión de Usuarios</h3>
                    <p className="text-muted">
                      Administra los usuarios y sus perfiles
                    </p>
                  </div>
                  <div className="admin-content-body">
                    {/* TODO: Implementar componente CRUDUsuarios */}
                    <div className="placeholder-content">
                      <i className="bi bi-people display-1 text-muted"></i>
                      <h4 className="mt-3">CRUD de Usuarios</h4>
                      <p className="text-muted">
                        Aquí podrás ver, editar, eliminar usuarios y actualizar roles.
                      </p>
                      <Button variant="primary">
                        <i className="bi bi-person-plus me-2"></i>
                        Ver Lista de Usuarios
                      </Button>
                    </div>
                    {/* <CRUDUsuarios /> */}
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>

      <Footer />
    </div>
  )
}

export default AdminPanel
