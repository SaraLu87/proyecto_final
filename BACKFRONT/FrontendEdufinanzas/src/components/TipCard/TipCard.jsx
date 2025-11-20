/**
 * Componente TipCard Reutilizable
 * Muestra una tarjeta de tip periódico con título y descripción
 * Se utiliza en la página de inicio
 */
import { Card } from 'react-bootstrap'
import './TipCard.css'

/**
 * @param {Object} tip - Objeto con los datos del tip
 * @param {Function} onClick - Función a ejecutar al hacer click
 */
const TipCard = ({ tip, onClick }) => {
  return (
    <Card className="tip-card" onClick={onClick}>
      <Card.Body>
        <Card.Title className="tip-card-title">💡 {tip.nombre}</Card.Title>
        <Card.Text className="tip-card-description">
          {tip.descripcion.length > 100
            ? `${tip.descripcion.substring(0, 100)}...`
            : tip.descripcion}
        </Card.Text>
        <div className="text-end">
          <small className="text-primary fw-semibold">Leer más →</small>
        </div>
      </Card.Body>
    </Card>
  )
}

export default TipCard
