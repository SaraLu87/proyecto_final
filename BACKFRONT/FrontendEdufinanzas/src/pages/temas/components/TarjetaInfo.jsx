// 📌 src/pages/temas/components/TarjetaInfo.jsx
// Tarjeta tipo "libro" para la sección LO QUE DEBES SABER

import "./temasComponents.css";

const TarjetaInfo = ({ titulo, descripcion }) => {
  return (
    <div className="tarjeta-info-gamificada animate-pop">
      <div className="tarjeta-info-icono">📘</div>

      <h3 className="tarjeta-info-titulo">{titulo}</h3>

      <p className="tarjeta-info-texto">
        {descripcion}
      </p>

      <div className="tarjeta-info-brillo"></div>
    </div>
  );
};

export default TarjetaInfo;
