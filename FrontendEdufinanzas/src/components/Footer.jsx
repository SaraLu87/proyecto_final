/**
 * COMPONENTE: FOOTER
 *
 * Pie de página para el panel de administración
 * - Basado en el Footer del frontend de usuario
 * - Mantiene el mismo diseño y estilos
 * - Gradiente azul-verde
 * - Enlaces y copyright
 */

import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-admin">
      <div className="footer-container">
        {/* Frase motivacional */}
        <div className="footer-message">
          <p className="footer-quote">
            "La educación financiera es la clave para el éxito económico"
          </p>
        </div>

        {/* Enlaces del footer */}
        <div className="footer-links">
          <a href="#" className="footer-link">Sobre Nosotros</a>
          <a href="#" className="footer-link">Misión</a>
          <a href="#" className="footer-link">Políticas de Privacidad</a>
          <a href="#" className="footer-link">Contacto</a>
        </div>

        {/* Copyright */}
        <div className="footer-copyright">
          <p>&copy; {new Date().getFullYear()} EduFinanzas. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
