/**
 * Componente RetoCard Reutilizable
 * Muestra una tarjeta de reto con información de costo, recompensa y estado
 */
import { Card, Badge } from 'react-bootstrap'
import './RetoCard.css'

/**
 * @param {Object} reto - Objeto con los datos del reto
 * @param {Function} onClick - Función a ejecutar al hacer click
 * @param {boolean} completado - Si el reto está completado
 * @param {boolean} bloqueado - Si el reto está bloqueado
 * @param {number} monedasDisponibles - Monedas disponibles del usuario
 */
const RetoCard = ({ reto, onClick, completado = false, bloqueado = false, monedasDisponibles = 0 }) => {
  const puedeAcceder = !bloqueado && (reto.costo_monedas === 0 || monedasDisponibles >= reto.costo_monedas)

  return (
    <Card
      className={`reto-card ${completado ? 'reto-completado' : ''} ${bloqueado ? 'reto-bloqueado' : ''}`}
      onClick={puedeAcceder ? onClick : undefined}
      style={{ cursor: puedeAcceder ? 'pointer' : 'not-allowed' }}
    >
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="reto-card-title mb-0">
            {reto.nombre_reto}
          </Card.Title>
          {completado && <Badge bg="success">✓ Completado</Badge>}
          {bloqueado && <Badge bg="secondary">🔒 Bloqueado</Badge>}
        </div>

        <Card.Text className="reto-card-description">
          {reto.descripcion}
        </Card.Text>

        <div className="reto-card-footer">
          <div className="reto-info">
            <span className="reto-costo">
              <strong>Costo:</strong> {reto.costo_monedas} 💰
            </span>
            <span className="reto-recompensa">
              <strong>Recompensa:</strong> {reto.recompensa_monedas} 💰
            </span>
          </div>

          {!puedeAcceder && !bloqueado && (
            <small className="text-danger">Monedas insuficientes</small>
          )}
        </div>
      </Card.Body>
    </Card>
  )
}

export default RetoCard
