/**
 * Componente TipModal Reutilizable
 * Modal para mostrar el contenido completo de un tip periódico
 */
import { Modal, Button } from 'react-bootstrap'
import './TipModal.css'

/**
 * @param {boolean} show - Controla si el modal está visible
 * @param {Function} onHide - Función para cerrar el modal
 * @param {Object} tip - Objeto con los datos del tip a mostrar
 */
const TipModal = ({ show, onHide, tip }) => {
  if (!tip) return null

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton className="tip-modal-header">
        <Modal.Title>💡 {tip.nombre}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="tip-modal-body">
        <p className="tip-modal-description">{tip.descripcion}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onHide}>
          Entendido
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default TipModal
