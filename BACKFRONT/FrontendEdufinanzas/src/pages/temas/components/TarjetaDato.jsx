// src/pages/temas/components/TarjetaDato.jsx
// Tarjeta gamificada para Datos Curiosos

import "./temasComponents.css";

const TarjetaDato = ({ texto }) => {
  return (
    <div className="tarjeta-dato-gamificada animate-pop">
      <div className="tarjeta-icono">💡</div>

      <p className="tarjeta-texto">{texto}</p>

      <div className="tarjeta-brillo"></div>
    </div>
  );
};

export default TarjetaDato;
