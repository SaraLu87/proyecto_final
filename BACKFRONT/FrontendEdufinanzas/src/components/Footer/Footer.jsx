/**
 * Componente Footer Reutilizable
 * Muestra el pie de página de la aplicación con información de derechos
 */
import './Footer.css'

const Footer = () => {
  const añoActual = new Date().getFullYear()

  return (
    <footer className="footer-edufinanzas">
      <div className="container">
        <div className="row">
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            <p className="mb-0">
              <strong>EduFinanzas</strong> - Aprende a manejar el dinero como un pro
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <p className="mb-0">
              &copy; {añoActual} EduFinanzas. Todos los derechos reservados.
            </p>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-12 text-center">
            <small className="text-muted">
              Educación financiera para jóvenes a partir de los 14 años
            </small>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
