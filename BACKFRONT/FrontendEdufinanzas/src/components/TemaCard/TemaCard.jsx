/**
 * Componente TemaCard Reutilizable
 * Muestra una tarjeta de tema con imagen, nombre y descripción
 * Se utiliza en la página de inicio y en la página de temas
 */
import { Card } from 'react-bootstrap'
import { getImageUrl } from '../../services/api'
import './TemaCard.css'

/**
 * @param {Object} tema - Objeto con los datos del tema
 * @param {Function} onClick - Función a ejecutar al hacer click
 * @param {boolean} bloqueado - Si el tema está bloqueado (solo para usuarios autenticados)
 */
const TemaCard = ({ tema, onClick, bloqueado = false }) => {
  return (
    <Card
      className={`tema-card ${bloqueado ? 'tema-bloqueado' : ''}`}
      onClick={!bloqueado ? onClick : undefined}
      style={{ cursor: bloqueado ? 'not-allowed' : 'pointer' }}
    >
      {/* Imagen del tema
          IMPORTANTE: Las imágenes se obtienen del backend
          Ruta: http://localhost:8000/media/temas/nombre_imagen.png
      */}
      <Card.Img
        variant="top"
        src={getImageUrl(tema.img_temas)}
        alt={tema.nombre}
        className="tema-card-img"
        onError={(e) => {
          // Si la imagen no carga, mostrar imagen por defecto
          e.target.src = '/assets/tema-default.png'
        }}
      />

      <Card.Body>
        <Card.Title className="tema-card-title">
          {tema.nombre}
          {bloqueado && <span className="ms-2">🔒</span>}
        </Card.Title>
        <Card.Text className="tema-card-description">
          {tema.descripcion}
        </Card.Text>
      </Card.Body>

      {/* Indicador de tema bloqueado */}
      {bloqueado && (
        <div className="tema-overlay">
          <div className="tema-bloqueado-texto">
            <span className="fs-1">🔒</span>
            <p className="mt-2 mb-0 fw-bold">Completa los temas anteriores</p>
          </div>
        </div>
      )}
    </Card>
  )
}

export default TemaCard
