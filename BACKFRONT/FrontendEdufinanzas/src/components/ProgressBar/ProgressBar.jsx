/**
 * Componente ProgressBar Reutilizable
 * Muestra una barra de progreso con porcentaje
 */
import { ProgressBar as BootstrapProgressBar } from 'react-bootstrap'
import './ProgressBar.css'

/**
 * @param {number} progreso - Porcentaje de progreso (0-100)
 * @param {string} label - Etiqueta opcional para mostrar sobre la barra
 */
const ProgressBar = ({ progreso = 0, label = '' }) => {
  // Asegurar que el progreso esté entre 0 y 100
  const porcentaje = Math.min(Math.max(progreso, 0), 100)

  return (
    <div className="progress-container">
      {label && <div className="progress-label mb-2">{label}</div>}
      <BootstrapProgressBar
        now={porcentaje}
        label={`${Math.round(porcentaje)}%`}
        variant={porcentaje === 100 ? 'success' : 'primary'}
        className="custom-progress-bar"
      />
    </div>
  )
}

export default ProgressBar
