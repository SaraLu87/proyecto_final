// src/pages/temas/components/CirculoReto.jsx
import "../temas.css";

const CirculoReto = ({ titulo, color, estado, onClick }) => {
  /*
     estado puede ser:
     - "bloqueado"
     - "disponible"
     - "completado"
  */

  const claseEstado =
    estado === "bloqueado"
      ? "circulo-bloqueado"
      : estado === "completado"
      ? "circulo-completado"
      : "";

  return (
    <div
      className={`circulo-reto circulo-${color} ${claseEstado}`}
      onClick={estado === "bloqueado" ? null : onClick}
    >
      <h5>{titulo}</h5>

      {estado === "bloqueado" && <span className="lock-icon">🔒</span>}
      {estado === "completado" && <span className="check-icon">✔</span>}
    </div>
  );
};

export default CirculoReto;
