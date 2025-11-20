// 📌 src/pages/temas/TemaCompletado.jsx
// Pantalla mostrada al terminar un tema
// Guarda monedas, progreso y desbloquea el siguiente tema

import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { useMonedas } from "../../context/MonedasContext";
import { useProgreso } from "../../context/ProgresoContext";
import { useUsuario } from "../../context/UsuarioContext";

import api from "../../services/api";

import "./temas.css";

const TemaCompletado = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const temaId = parseInt(id);

  const { usuario } = useUsuario();
  const { ganarMonedas, marcarTemaCompletado } = useMonedas();
  const { registrarTemaFinalizado } = useProgreso();

  // Tabla de recompensas (según tu lógica)
  const RECOMPENSAS = {
    1: 250,
    2: 400,
    3: 350,
    4: 10000,
  };

  const recompensa = RECOMPENSAS[temaId] || 0;

  // Siguiente tema
  const siguienteTema = temaId < 4 ? temaId + 1 : null;

  // --------------------------------------------------------
  // SE EJECUTA UNA SOLA VEZ
  // Guarda todo en BD y contextos
  // --------------------------------------------------------
  useEffect(() => {
    const procesarFinalizacion = async () => {
      // 1. Entregar monedas al usuario
      await ganarMonedas(recompensa);

      // 2. Guardar finalización en BD (cuando esté lista)
      /*
      await api.post("/progreso/tema-finalizado/", {
        id_usuario: usuario.id_usuario,
        id_tema: temaId,
        fecha: new Date().toISOString()
      });
      */

      // 3. Guardar en contexto de progreso (local)
      registrarTemaFinalizado(temaId);

      // 4. Marcar tema como completado (para desbloquear siguiente)
      marcarTemaCompletado(temaId);
    };

    procesarFinalizacion();
  }, []);

  return (
    <>
      <Header />

      <div className="tema-completado-contenedor">

        <div className="tema-completado-card animate-pop">
          <h1>🎉 ¡Tema {temaId} completado!</h1>

          <p className="mensaje">
            ¡Excelente trabajo! Sigue aprendiendo para mejorar tus finanzas.
          </p>

          <h2 className="recompensa">+ {recompensa} monedas 💰</h2>

          <div className="botones-final">
            {/* Volver al menú principal */}
            <button
              className="btn-volver"
              onClick={() => navigate("/")}
            >
              Volver al Inicio
            </button>

            {/* Ir al siguiente tema */}
            {siguienteTema ? (
              <button
                className="btn-siguiente"
                onClick={() => navigate(`/tema/${siguienteTema}`)}
              >
                Ir al Tema {siguienteTema} →
              </button>
            ) : (
              <p className="mensaje-final">
                🌟 ¡Has terminado todos los temas!  
                Ahora aplica en tu vida lo aprendido. 💚
              </p>
            )}
          </div>

        </div>

      </div>

      <Footer />
    </>
  );
};

export default TemaCompletado;
