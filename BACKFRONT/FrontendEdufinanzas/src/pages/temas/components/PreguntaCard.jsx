// 📌 PreguntaCard GAMIFICADA
// Tarjeta moderna con colores, animaciones y validación visual

import { useState } from "react";
import "./temasComponents.css";

const PreguntaCard = ({ pregunta }) => {
  const [seleccion, setSeleccion] = useState(null);
  const [estado, setEstado] = useState(null); // "ok" | "mal"

  const opciones = [
    pregunta.respuesta_uno,
    pregunta.respuesta_dos,
    pregunta.respuesta_tres,
    pregunta.respuesta_cuatro,
  ];

  const validar = (opcion) => {
    setSeleccion(opcion);

    if (opcion === pregunta.respuestaCorrecta) {
      setEstado("ok");
    } else {
      setEstado("mal");
    }

    // 🟦 CUANDO BACKEND ESTÉ LISTO, ACTIVAR:
    /*
    await api.post("/progreso/responder", {
      id_reto: pregunta.id_reto,
      respuesta: opcion,
    });
    */
  };

  return (
    <div className="pregunta-tarjeta animate-pop">

      <h3 className="pregunta-titulo">{pregunta.nombre_reto}</h3>
      <p className="pregunta-descripcion">{pregunta.descripcion}</p>

      <div className="contenedor-opciones">
        {opciones.map((op, index) => (
          <button
            key={index}
            className={`opcion-gamificada
              ${seleccion === op && estado === "ok" ? "opcion-correcta" : ""}
              ${seleccion === op && estado === "mal" ? "opcion-incorrecta" : ""}
            `}
            onClick={() => validar(op)}
            disabled={!!seleccion}
          >
            {op}
          </button>
        ))}
      </div>

      {estado === "ok" && (
        <p className="mensaje-correcto">✔ ¡Súper! Respuesta correcta 🎉</p>
      )}

      {estado === "mal" && (
        <p className="mensaje-incorrecto">
          ✖ La correcta era: <strong>{pregunta.respuestaCorrecta}</strong>
        </p>
      )}
    </div>
  );
};

export default PreguntaCard;
